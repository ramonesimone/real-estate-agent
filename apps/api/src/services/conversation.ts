import { prisma } from '../lib/prisma.js'
import { logger } from '../lib/logger.js'

export async function logConversation(params: {
  leadId: string
  channel: string
  direction: string
  message: string
}) {
  try {
    await prisma.conversation.create({
      data: {
        lead_id: params.leadId,
        channel: params.channel,
        direction: params.direction,
        message: params.message,
      },
    })
  } catch (err) {
    logger.error({ err, leadId: params.leadId }, 'Failed to log conversation')
  }
}

export async function getConversationHistory(
  leadId: string
): Promise<Array<{ role: 'user' | 'assistant'; content: string }>> {
  const history = await prisma.conversation.findMany({
    where: { lead_id: leadId },
    orderBy: { timestamp: 'asc' },
  })

  return history.map((msg) => ({
    role: msg.direction === 'INBOUND' ? 'user' : 'assistant',
    content: msg.message,
  }))
}

export async function getLeadSummary(leadId: string) {
  const lead = await prisma.lead.findUnique({ where: { id: leadId } })
  if (!lead) return null
  return [
    `Name: ${lead.name ?? 'Not provided'}`,
    `Phone: ${lead.phone}`,
    `Intent: ${lead.intent ?? 'Not yet determined'}`,
    `Budget: ${lead.budget_min ? `$${lead.budget_min.toLocaleString()}` : 'Not specified'}${lead.budget_max ? ` - $${lead.budget_max.toLocaleString()}` : ''}`,
    `Timeline: ${lead.timeline ?? 'Not specified'}`,
    `Location: ${lead.location_pref ?? 'Not specified'}`,
    `Status: ${lead.status}`,
    `Score: ${lead.score}/100`,
  ].join('\n')
}
