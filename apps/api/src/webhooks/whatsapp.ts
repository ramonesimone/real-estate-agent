import { Router, Request, Response } from 'express'
import crypto from 'node:crypto'
import { prisma } from '../lib/prisma.js'
import { logger } from '../lib/logger.js'
import { respondQueue, qualifyQueue, nurtureQueue } from '../queues/index.js'

const router = Router()

router.get('/webhooks/whatsapp', (req: Request, res: Response) => {
  const mode = req.query['hub.mode']
  const token = req.query['hub.verify_token']
  const challenge = req.query['hub.challenge']

  const expectedToken = process.env.WHATSAPP_VERIFY_TOKEN

  if (mode === 'subscribe' && token === expectedToken && challenge) {
    logger.info('WhatsApp webhook verified')
    res.status(200).send(challenge)
  } else {
    res.status(403).send('Verification failed')
  }
})

function verifySignature(req: Request): boolean {
  const signature = req.headers['x-hub-signature-256'] as string
  if (!signature) return false

  const appSecret = process.env.WHATSAPP_APP_SECRET
  if (!appSecret) return false

  const expected = crypto
    .createHmac('sha256', appSecret)
    .update(JSON.stringify(req.body))
    .digest('hex')

  return signature === `sha256=${expected}`
}

router.post('/webhooks/whatsapp', async (req: Request, res: Response) => {
  if (!verifySignature(req)) {
    logger.warn('Invalid WhatsApp webhook signature')
    res.status(401).json({ success: false, error: 'Invalid signature' })
    return
  }

  res.status(200).send('OK')

  try {
    const entry = req.body?.entry?.[0]
    const change = entry?.changes?.[0]
    const value = change?.value

    if (!value?.messages?.[0]) return

    const msg = value.messages[0]
    const phone = msg.from
    const text = msg.text?.body ?? ''
    const timestamp = parseInt(msg.timestamp, 10)

    logger.info({ phone, text }, 'Inbound WhatsApp message')

    let lead = await prisma.lead.findUnique({ where: { phone } })

    if (!lead) {
      lead = await prisma.lead.create({
        data: {
          phone,
          source: 'WHATSAPP',
          status: 'NEW',
        },
      })

      await prisma.conversation.create({
        data: {
          lead_id: lead.id,
          channel: 'WHATSAPP',
          direction: 'INBOUND',
          message: text,
        },
      })

      await respondQueue.add('respond-to-new-lead', { leadId: lead.id })
    } else {
      await prisma.conversation.create({
        data: {
          lead_id: lead.id,
          channel: 'WHATSAPP',
          direction: 'INBOUND',
          message: text,
        },
      })

      if (lead.status === 'NEW' || lead.status === 'CONTACTED') {
        await qualifyQueue.add('qualify-lead', { leadId: lead.id, message: text })
      } else if (lead.status === 'COLD' || lead.status === 'DEAD') {
        const activeJobs = await nurtureQueue.getJobs(['active', 'waiting', 'delayed'])
        for (const job of activeJobs) {
          if (job.data.leadId === lead.id) {
            await job.remove()
          }
        }

        await prisma.lead.update({
          where: { id: lead.id },
          data: { status: 'CONTACTED' },
        })

        await prisma.nurtureSequence.updateMany({
          where: { lead_id: lead.id, active: true },
          data: { active: false },
        })

        await qualifyQueue.add('qualify-lead', { leadId: lead.id, message: text })
      } else {
        await qualifyQueue.add('qualify-lead', { leadId: lead.id, message: text })
      }
    }
  } catch (err) {
    logger.error({ err }, 'Error processing WhatsApp webhook')
  }
})

export default router
