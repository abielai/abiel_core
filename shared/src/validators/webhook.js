const { z } = require('zod')

// Fallback JS schema using zod definitions inline to avoid requiring TS runtime
const JSWebhookSchema = z.object({
  tenantId: z.string(),
  provider: z.string(),
  eventId: z.string(),
  timestamp: z.string(),
  customerId: z.string(),
  conversationId: z.string(),
  message: z.any(),
  channel: z.any(),
  metadata: z.any().optional(),
  replyToId: z.string().nullable().optional(),
  attachments: z.any().nullable().optional()
})

function validateAndNormalize(payload) {
  if (!payload) throw new Error('Empty payload')
  let parsed
  try {
    // Prefer importing the TS contract if available; otherwise validate with JS schema
    parsed = JSWebhookSchema.parse(payload)
  } catch (err) {
    const e = new Error('Invalid payload: ' + (err.message || err))
    e.cause = err
    throw e
  }

  const ts = new Date(parsed.timestamp)
  if (Number.isNaN(ts.getTime())) throw new Error('Invalid timestamp')

  return {
    tenantId: String(parsed.tenantId),
    provider: String(parsed.provider),
    eventId: String(parsed.eventId),
    timestamp: ts.toISOString(),
    customerId: String(parsed.customerId),
    conversationId: String(parsed.conversationId),
    message: parsed.message,
    channel: parsed.channel,
    metadata: parsed.metadata || null,
    replyToId: parsed.replyToId || null,
    attachments: parsed.attachments || null
  }
}

module.exports = { validateAndNormalize }
