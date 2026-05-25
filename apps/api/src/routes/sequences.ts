import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { logger } from '../lib/logger.js'

const router = Router()

router.get('/api/sequences', async (_req: Request, res: Response) => {
  try {
    const sequences = await prisma.nurtureSequence.findMany({
      include: { lead: true },
      orderBy: { next_send_at: 'asc' },
    })
    res.json(sequences)
  } catch (err) {
    logger.error({ err }, 'Error fetching sequences')
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.patch('/api/sequences/:id', async (req: Request, res: Response) => {
  try {
    const sequence = await prisma.nurtureSequence.update({
      where: { id: req.params.id },
      data: { active: req.body.active },
    })
    res.json(sequence)
  } catch (err) {
    logger.error({ err }, 'Error updating sequence')
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
