import { Router, Request, Response } from 'express'
import { z } from 'zod'
import { prisma } from '../lib/prisma.js'
import { matchQueue } from '../queues/index.js'
import { logger } from '../lib/logger.js'

const router = Router()

const propertySchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  type: z.enum(['SALE', 'RENT']),
  bedrooms: z.number().int().positive(),
  bathrooms: z.number().int().positive(),
  location: z.string().min(1),
  area: z.string().min(1),
  amenities: z.array(z.string()).default([]),
  images: z.array(z.string()).default([]),
  agent_id: z.string().optional(),
})

function parseProperty(property: Record<string, unknown>) {
  if (typeof property.amenities === 'string') {
    try { property.amenities = JSON.parse(property.amenities as string) } catch { property.amenities = [] }
  }
  if (typeof property.images === 'string') {
    try { property.images = JSON.parse(property.images as string) } catch { property.images = [] }
  }
  return property
}

router.get('/api/properties', async (_req: Request, res: Response) => {
  try {
    const properties = await prisma.property.findMany({
      orderBy: { created_at: 'desc' },
    })
    res.json(properties.map(p => parseProperty(p as any)))
  } catch (err) {
    logger.error({ err }, 'Error fetching properties')
    res.status(500).json({ error: 'Internal server error' })
  }
})

router.post('/api/properties', async (req: Request, res: Response) => {
  try {
    const parsed = propertySchema.parse(req.body)
    const property = await prisma.property.create({
      data: {
        ...parsed,
        amenities: JSON.stringify(parsed.amenities),
        images: JSON.stringify(parsed.images),
        status: 'AVAILABLE',
        agent_id: parsed.agent_id ?? '',
      },
    })

    await matchQueue.add('match-property', { propertyId: property.id })

    res.status(201).json(parseProperty(property as any))
  } catch (err) {
    if (err instanceof z.ZodError) {
      res.status(400).json({ error: 'Validation error', details: err.errors })
      return
    }
    logger.error({ err }, 'Error creating property')
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
