import OpenAI from 'openai'
import pino from 'pino'

const logger = pino({ name: 'openrouter' })

export function createOpenRouterClient(): OpenAI {
  const apiKey = process.env.OPENROUTER_API_KEY
  if (!apiKey) {
    throw new Error('OPENROUTER_API_KEY is not set')
  }
  return new OpenAI({
    baseURL: 'https://openrouter.ai/api/v1',
    apiKey,
    defaultHeaders: {
      'HTTP-Referer': 'https://github.com/real-estate-agent',
      'X-Title': 'Real Estate AI Agent',
    },
  })
}

export async function callModel(params: {
  systemPrompt: string
  messages: Array<{ role: 'user' | 'assistant'; content: string }>
  model?: string
  temperature?: number
  maxTokens?: number
}): Promise<string> {
  const client = createOpenRouterClient()
  const model = params.model ?? process.env.OPENROUTER_MODEL ?? 'anthropic/claude-sonnet-4-20250514'

  logger.info({ model, messageCount: params.messages.length }, 'Calling OpenRouter')

  const response = await client.chat.completions.create({
    model,
    messages: [
      { role: 'system', content: params.systemPrompt },
      ...params.messages,
    ],
    temperature: params.temperature ?? 0.7,
    max_tokens: params.maxTokens ?? 500,
  })

  const content = response.choices[0]?.message?.content
  if (!content) {
    throw new Error('Empty response from OpenRouter')
  }

  return typeof content === 'string' ? content : content[0]?.text ?? ''
}
