import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { logger } from '../lib/logger.js'

const router = Router()

router.get('/api/leads', async (_req: Request, res: Response) => {
  try {
    const leads = await prisma.lead.findMany({
      orderBy: { created_at: 'desc' },
    })
    res.json(leads)
  } catch (err) {
    logger.error({ err }, 'Error fetching leads')
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/api/leads/:id', async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.findUnique({ where: { id: req.params.id } })
    if (!lead) {
      res.status(404).json({ error: 'Lead not found' })
      return
    }
    res.json(lead)
  } catch (err) {
    logger.error({ err }, 'Error fetching lead')
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/api/leads/:id', async (req: Request, res: Response) => {
  try {
    const lead = await prisma.lead.update({
      where: { id: req.params.id },
      data: req.body,
    })
    res.json(lead)
  } catch (err) {
    logger.error({ err }, 'Error updating lead')
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.get('/api/leads/:id/conversations', async (req: Request, res: Response) => {
  try {
    const conversations = await prisma.conversation.findMany({
      where: { lead_id: req.params.id },
      orderBy: { timestamp: 'asc' },
    })
    res.json(conversations)
  } catch (err) {
    logger.error({ err }, 'Error fetching conversations')
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
