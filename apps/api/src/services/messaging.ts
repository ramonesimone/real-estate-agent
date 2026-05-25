import { logger } from '../lib/logger.js'

const hasTwilio = !!(
  process.env.TWILIO_ACCOUNT_SID &&
  process.env.TWILIO_AUTH_TOKEN &&
  process.env.TWILIO_WHATSAPP_NUMBER
)

let twilioClient: import('twilio').Twilio | null = null

async function getTwilioClient(): Promise<import('twilio').Twilio | null> {
  if (twilioClient) return twilioClient
  try {
    const twilio = await import('twilio')
    const accountSid = process.env.TWILIO_ACCOUNT_SID!
    const authToken = process.env.TWILIO_AUTH_TOKEN!
    twilioClient = twilio(accountSid, authToken) as any
    return twilioClient
  } catch {
    return null
  }
}

export async function sendWhatsApp(
  to: string,
  body: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
  if (!hasTwilio) {
    logger.info({ to, body }, '[DEMO] WhatsApp message (not sent — Twilio not configured)')
    return { success: true, sid: 'demo-mode' }
  }

  try {
    const from = process.env.TWILIO_WHATSAPP_NUMBER!
    const client = await getTwilioClient()
    if (!client) throw new Error('Failed to initialize Twilio client')
    const message = await client.messages.create({
      from: `whatsapp:${from}`,
      to: `whatsapp:${to}`,
      body,
    })
    logger.info({ sid: message.sid, to }, 'WhatsApp message sent')
    return { success: true, sid: message.sid }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    logger.error({ error, to }, 'Failed to send WhatsApp message')
    return { success: false, error }
  }
}

export async function sendSMS(
  to: string,
  body: string
): Promise<{ success: boolean; sid?: string; error?: string }> {
  if (!hasTwilio) {
    logger.info({ to, body }, '[DEMO] SMS (not sent — Twilio not configured)')
    return { success: true, sid: 'demo-mode' }
  }

  try {
    const from = process.env.TWILIO_WHATSAPP_NUMBER!
    const client = await getTwilioClient()
    if (!client) throw new Error('Failed to initialize Twilio client')
    const message = await client.messages.create({ from, to, body })
    logger.info({ sid: message.sid, to }, 'SMS sent')
    return { success: true, sid: message.sid }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    logger.error({ error, to }, 'Failed to send SMS')
    return { success: false, error }
  }
}
