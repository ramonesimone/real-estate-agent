import { Router, Request, Response } from 'express'
import { prisma } from '../lib/prisma.js'
import { logger } from '../lib/logger.js'

const router = Router()

router.get('/api/dashboard/stats', async (_req: Request, res: Response) => {
  try {
    const [totalLeads, leads, todayNew, todayConvs, todayConverted] = await Promise.all([
      prisma.lead.count(),
      prisma.lead.findMany(),
      prisma.lead.count({
        where: { created_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } },
      }),
      prisma.conversation.count({
        where: { timestamp: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }, direction: 'OUTBOUND' },
      }),
      prisma.lead.count({
        where: {
          status: 'CONVERTED',
          updated_at: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
    ])

    const statusBreakdown: Record<string, number> = {}
    for (const lead of leads) {
      statusBreakdown[lead.status] = (statusBreakdown[lead.status] ?? 0) + 1
    }

    const hotLeads = leads
      .filter((l) => l.score >= 80)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)

    res.json({
      totalLeads,
      statusBreakdown,
      todayNewLeads: todayNew,
      todayMessagesSent: todayConvs,
      todayLeadsConverted: todayConverted,
      hotLeads,
    })
  } catch (err) {
    logger.error({ err }, 'Error fetching dashboard stats')
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
