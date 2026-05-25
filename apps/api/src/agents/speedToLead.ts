import { callModel } from '../lib/openrouter.js'
import { logger } from '../lib/logger.js'

const SYSTEM_PROMPT = `You are a friendly, professional real estate assistant for AGENCY_NAME.
A new lead has just made an inquiry. Your job is to send the first response
message within 60 seconds.

Rules:
- Be warm and conversational, never robotic
- Keep the first message short — 2 to 3 sentences maximum
- End with exactly ONE qualifying question to start the conversation
- Never mention that you are an AI unless directly asked
- Write in the same language the lead used. Default to English.
- Use first name if available

Good qualifying questions to choose from based on context:
- "Are you looking to buy or rent?"
- "What area of the city are you focused on?"
- "What is your ideal timeline for moving?"
- "Are you buying for personal use or as an investment?"

Return only the message text. No preamble, no explanation.`

export async function generateSpeedToLeadResponse(params: {
  name?: string | null
  source: string
  message?: string | null
}): Promise<string> {
  const agencyName = process.env.AGENCY_NAME ?? 'our agency'
  const systemPrompt = SYSTEM_PROMPT.replace('AGENCY_NAME', agencyName)

  const userContent = [
    `Lead details:`,
    `Name: ${params.name ?? 'Not provided'}`,
    `Source: ${params.source}`,
    params.message ? `Their message: ${params.message}` : 'No initial message (missed call / silent lead)',
  ].join('\n')

  logger.info({ source: params.source }, 'Generating speed-to-lead response')

  return callModel({
    systemPrompt,
    messages: [{ role: 'user', content: userContent }],
    temperature: 0.8,
    maxTokens: 200,
  })
}
