import { callModel } from '../lib/openrouter.js'
import { logger } from '../lib/logger.js'

export async function generateMatchAlert(params: {
  propertyDetails: string
  buyerProfile: string
}): Promise<string> {
  const systemPrompt = `You are sending a personalized property match alert to a buyer via WhatsApp.

Property details:
${params.propertyDetails}

Buyer profile:
${params.buyerProfile}

Write a WhatsApp message that:
- Opens with their name
- Explains specifically WHY this property matches what they told you they wanted
- Highlights the 2–3 most relevant features for this specific buyer
- Includes the price
- Ends with a single clear call to action: schedule a viewing or ask for more photos
- Feels personal, not like a mass blast
- Is under 150 words

Return only the message text.`

  logger.info('Generating property match alert')

  return callModel({
    systemPrompt,
    messages: [{ role: 'user', content: 'Write the match alert message.' }],
    temperature: 0.7,
    maxTokens: 300,
  })
}
