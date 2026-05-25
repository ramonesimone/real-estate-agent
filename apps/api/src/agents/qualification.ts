import { callModel } from '../lib/openrouter.js'
import { logger } from '../lib/logger.js'
import type { QualificationResult } from '@real-estate/shared'

const SYSTEM_PROMPT = `You are a real estate assistant qualifying a potential buyer or renter.
Your goal is to naturally extract these four data points through conversation:
1. Intent: are they buying, renting, selling, or investing?
2. Budget: what is their price range?
3. Timeline: how soon do they need to move or transact?
4. Location: which area or neighborhood are they targeting?

Rules:
- Ask only ONE question per message
- Never ask all four questions at once — it feels like an interrogation
- Once you have all four data points, summarize what you have heard and ask
  if there is anything else they want you to know
- Be conversational, warm, and local-feeling
- If they mention local neighborhoods or landmarks, show familiarity
- Never break character

Current lead data extracted so far:
{{lead_partial_data}}

Full conversation so far:
{{conversation_history}}

Latest message from lead:
{{latest_message}}

Respond with:
1. Your reply message (2–3 sentences max)
2. A JSON block on a new line with any newly extracted data:
   {"intent": null, "budget_min": null, "budget_max": null,
    "timeline": null, "location_pref": null}
   Fill only the fields you extracted from THIS message. Leave others null.`

export async function generateQualificationResponse(params: {
  leadPartialData: string
  conversationHistory: string
  latestMessage: string
}): Promise<{ reply: string; data: Partial<QualificationResult> }> {
  const systemPrompt = SYSTEM_PROMPT
    .replace('{{lead_partial_data}}', params.leadPartialData)
    .replace('{{conversation_history}}', params.conversationHistory)
    .replace('{{latest_message}}', params.latestMessage)

  logger.info('Generating qualification response')

  const raw = await callModel({
    systemPrompt,
    messages: [{ role: 'user', content: params.latestMessage }],
    temperature: 0.7,
    maxTokens: 400,
  })

  return parseQualificationResponse(raw)
}

function parseQualificationResponse(raw: string): {
  reply: string
  data: Partial<QualificationResult>
} {
  const jsonMatch = raw.match(/\{[^]*?"intent"[^]*?"timeline"[^]*?\}/)
  let data: Partial<QualificationResult> = {}

  if (jsonMatch) {
    try {
      data = JSON.parse(jsonMatch[0])
    } catch {
      logger.warn({ raw }, 'Failed to parse qualification JSON from Claude response')
    }
  }

  let reply = raw
  if (jsonMatch) {
    reply = raw.replace(jsonMatch[0], '').trim()
  }

  return { reply, data }
}
