import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { respondQueue } from '../queues/index.js'
import { logger } from '../lib/logger.js'

const router = Router()

const newLeadSchema = z.object({
  source: z.enum(['WEBSITE', 'WHATSAPP', 'REFERRAL']),
  phone: z.string().min(5),
  name: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
})

function normalizePhone(phone: string): string {
  if (phone.startsWith('0')) return '+234' + phone.slice(1)
  if (phone.startsWith('+')) return phone
  return '+' + phone
}

router.post('/webhooks/new-lead', async (req: Request, res: Response) => {
  try {
    const parsed = newLeadSchema.parse(req.body)
    const phone = normalizePhone(parsed.phone)

    const lead = await prisma.lead.create({
      data: {
        phone,
        name: parsed.name ?? null,
        source: parsed.source,
        status: 'NEW',
      },
    })

    logger.info({ leadId: lead.id, source: parsed.source }, 'New lead created')

    if (parsed.message) {
      await prisma.conversation.create({
        data: {
          lead_id: lead.id,
          channel: 'WHATSAPP',
          direction: 'INBOUND',
          message: parsed.message,
        },
      })
    }

    await respondQueue.add('respond-to-new-lead', { leadId: lead.id })

    res.status(201).json({ success: true, leadId: lead.id })
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ success: false, errors: err.errors })
      return
    }
    logger.error({ err }, 'Error in new-lead webhook')
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

export default router
