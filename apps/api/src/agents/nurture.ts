import { callModel } from '../lib/openrouter.js'
import { logger } from '../lib/logger.js'
import { NURTURE_STEP_PURPOSES } from '@real-estate/shared'

export async function generateNurtureMessage(params: {
  step: number
  leadSummary: string
  daysSinceContact: number
  originalMessage?: string | null
}): Promise<string> {
  const purpose = NURTURE_STEP_PURPOSES[params.step] ?? 'General follow-up'

  const systemPrompt = `You are writing a WhatsApp message to a real estate lead who has gone quiet.
This is step ${params.step} of a 90-day nurture sequence.

Step purpose: ${purpose}
Lead profile:
${params.leadSummary}
Days since last contact: ${params.daysSinceContact}
Their original inquiry: ${params.originalMessage ?? 'Not available'}

Write a single WhatsApp message that:
- Feels personal and hand-written, not automated
- References something specific from their original inquiry
- Provides genuine value (insight, new listing, or useful tip)
- Ends with a soft, low-pressure question or statement
- Is 3–5 sentences maximum
- Never uses generic openers like "I hope this message finds you well"

Return only the message text.`

  logger.info({ step: params.step }, 'Generating nurture message')

  return callModel({
    systemPrompt,
    messages: [{ role: 'user', content: 'Write the nurture message.' }],
    temperature: 0.8,
    maxTokens: 300,
  })
}
