import { prisma } from '../lib/prisma.js'
import { logger } from '../lib/logger.js'
import { sendWhatsApp } from '../services/messaging.js'
import { logConversation, getConversationHistory, getLeadSummary } from '../services/conversation.js'
import { generateSpeedToLeadResponse } from '../agents/speedToLead.js'
import { generateQualificationResponse } from '../agents/qualification.js'
import { generateNurtureMessage } from '../agents/nurture.js'
import { generateMatchAlert } from '../agents/matching.js'
import { createWorker, nurtureQueue } from './index.js'
import { scoreLead, NURTURE_STEP_DELAYS } from '@real-estate/shared'

export function registerWorkers() {
  createWorker('respond-to-new-lead', async (job) => {
    const { leadId } = job.data
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) {
      logger.warn({ leadId }, 'Lead not found for speed-to-lead')
      return
    }

    const conversation = await prisma.conversation.findFirst({
      where: { lead_id: leadId, direction: 'INBOUND' },
      orderBy: { timestamp: 'asc' },
    })

    const reply = await generateSpeedToLeadResponse({
      name: lead.name,
      source: lead.source,
      message: conversation?.message ?? null,
    })

    const msgResult = await sendWhatsApp(lead.phone, reply)
    if (msgResult.success) {
      await logConversation({
        leadId,
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        message: reply,
      })

      await prisma.lead.update({
        where: { id: leadId },
        data: { status: 'CONTACTED' },
      })
    }
  })

  createWorker('qualify-lead', async (job) => {
    const { leadId, message } = job.data
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) return

    const history = await getConversationHistory(leadId)
    const historyText = history.map((m) => `${m.role}: ${m.content}`).join('\n')

    const partialData = [
      `Intent: ${lead.intent ?? 'Not set'}`,
      `Budget: ${lead.budget_min ?? 'Not set'} - ${lead.budget_max ?? 'Not set'}`,
      `Timeline: ${lead.timeline ?? 'Not set'}`,
      `Location: ${lead.location_pref ?? 'Not set'}`,
    ].join('\n')

    const { reply, data } = await generateQualificationResponse({
      leadPartialData: partialData,
      conversationHistory: historyText,
      latestMessage: message,
    })

    const msgResult = await sendWhatsApp(lead.phone, reply)
    if (msgResult.success) {
      await logConversation({
        leadId,
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        message: reply,
      })
    }

    const updates: Record<string, unknown> = {}
    if (data.intent) updates.intent = data.intent
    if (data.budget_min !== null && data.budget_min !== undefined) updates.budget_min = data.budget_min
    if (data.budget_max !== null && data.budget_max !== undefined) updates.budget_max = data.budget_max
    if (data.timeline) updates.timeline = data.timeline
    if (data.location_pref) updates.location_pref = data.location_pref

    if (Object.keys(updates).length > 0) {
      const updated = await prisma.lead.update({
        where: { id: leadId },
        data: updates,
      })

      const newScore = scoreLead(updated)
      await prisma.lead.update({
        where: { id: leadId },
        data: { score: newScore },
      })

      if (newScore >= 80) {
        const agentMessage = `🔴 HOT LEAD ALERT\n${lead.name ?? 'Unknown'}\n${lead.phone}\nScore: ${newScore}/100\nIntent: ${updated.intent ?? 'N/A'}\nBudget: ${updated.budget_min ?? '?'} - ${updated.budget_max ?? '?'}`
        const agentId = lead.agent_id
        if (agentId) {
          const agent = await prisma.agent.findUnique({ where: { id: agentId } })
          if (agent) {
            await sendWhatsApp(agent.phone, agentMessage)
          }
        }
      }

      if (newScore < 50) {
        await prisma.lead.update({
          where: { id: leadId },
          data: { status: 'COLD' },
        })

        await scheduleNurtureSequence(leadId, lead.phone, lead.name)
      } else if (newScore >= 80) {
        await prisma.lead.update({
          where: { id: leadId },
          data: { status: 'HOT' },
        })
      } else {
        await prisma.lead.update({
          where: { id: leadId },
          data: { status: 'QUALIFIED' },
        })
      }
    }
  })

  createWorker('send-nurture-step', async (job) => {
    const { leadId, step } = job.data
    const lead = await prisma.lead.findUnique({ where: { id: leadId } })
    if (!lead) return

    const sequence = await prisma.nurtureSequence.findFirst({
      where: { lead_id: leadId, active: true },
    })
    if (!sequence) return

    const summary = await getLeadSummary(leadId)
    if (!summary) return

    const firstMessage = await prisma.conversation.findFirst({
      where: { lead_id: leadId, direction: 'INBOUND' },
      orderBy: { timestamp: 'asc' },
    })

    const daysSinceContact = Math.floor(
      (Date.now() - (firstMessage?.timestamp.getTime() ?? Date.now())) /
        (1000 * 60 * 60 * 24)
    )

    const message = await generateNurtureMessage({
      step,
      leadSummary: summary,
      daysSinceContact,
      originalMessage: firstMessage?.message,
    })

    const msgResult = await sendWhatsApp(lead.phone, message)
    if (msgResult.success) {
      await logConversation({
        leadId,
        channel: 'WHATSAPP',
        direction: 'OUTBOUND',
        message,
      })

      const nextStep = step + 1
      if (nextStep <= 9) {
        const daysUntilNext = NURTURE_STEP_DELAYS[nextStep - 1] - NURTURE_STEP_DELAYS[step - 1]
        await nurtureQueue.add(
          'send-nurture-step',
          { leadId, step: nextStep },
          { delay: daysUntilNext * 24 * 60 * 60 * 1000 }
        )

        const nextDate = new Date(Date.now() + daysUntilNext * 24 * 60 * 60 * 1000)
        await prisma.nurtureSequence.update({
          where: { id: sequence.id },
          data: { current_step: nextStep, next_send_at: nextDate },
        })
      } else {
        await prisma.nurtureSequence.update({
          where: { id: sequence.id },
          data: { active: false },
        })
        await prisma.lead.update({
          where: { id: leadId },
          data: { status: 'DEAD' },
        })
      }
    }
  })

  createWorker('match-property', async (job) => {
    const { propertyId } = job.data
    const property = await prisma.property.findUnique({ where: { id: propertyId } })
    if (!property) return

    const candidates = await prisma.lead.findMany({
      where: {
        status: { in: ['QUALIFIED', 'HOT', 'CONTACTED'] },
        intent: property.type === 'SALE' ? 'BUY' : 'RENT',
        budget_max: { gte: property.price * 0.9 },
        bedrooms: {
          lte: property.bedrooms + 1,
          gte: property.bedrooms - 1,
        },
      },
    })

    let amenities: string[] = []
    if (typeof property.amenities === 'string') {
      try { amenities = JSON.parse(property.amenities) } catch {}
    }

    const propDetails = [
      `Title: ${property.title}`,
      `Price: $${property.price.toLocaleString()}`,
      `Location: ${property.location}, ${property.area}`,
      `Bedrooms: ${property.bedrooms}, Bathrooms: ${property.bathrooms}`,
      `Amenities: ${amenities.join(', ')}`,
    ].join('\n')

    for (const buyer of candidates) {
      const buyerProfile = [
        `Name: ${buyer.name ?? 'Valued Client'}`,
        `Looking for: ${buyer.intent}`,
        `Budget: ${buyer.budget_min ?? '?'} - ${buyer.budget_max ?? '?'}`,
        `Preferred area: ${buyer.location_pref ?? 'Not specified'}`,
        `Bedrooms needed: ${buyer.bedrooms ?? 'Not specified'}`,
      ].join('\n')

      const alert = await generateMatchAlert({
        propertyDetails: propDetails,
        buyerProfile,
      })

      const msgResult = await sendWhatsApp(buyer.phone, alert)
      if (msgResult.success) {
        await logConversation({
          leadId: buyer.id,
          channel: 'WHATSAPP',
          direction: 'OUTBOUND',
          message: alert,
        })
      }
    }
  })
}

async function scheduleNurtureSequence(leadId: string, phone: string, name: string | null) {
  const nextDate = new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)

  await prisma.nurtureSequence.create({
    data: {
      lead_id: leadId,
      sequence_type: 'COLD_NURTURE',
      current_step: 1,
      next_send_at: nextDate,
      active: true,
    },
  })

  await nurtureQueue.add(
    'send-nurture-step',
    { leadId, step: 1 },
    { delay: 3 * 24 * 60 * 60 * 1000 }
  )
}
