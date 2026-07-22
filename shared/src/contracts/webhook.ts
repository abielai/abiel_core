import { z } from 'zod'

export const WebhookSchema = z.object({
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

export const NormalizedWebhookSchema = z.object({
  tenantId: z.string(),
  provider: z.string(),
  eventId: z.string(),
  timestamp: z.string(),
  customerId: z.string(),
  conversationId: z.string(),
  message: z.any(),
  channel: z.any(),
  metadata: z.any().nullable(),
  replyToId: z.string().nullable(),
  attachments: z.any().nullable()
})

export type WebhookPayload = z.infer<typeof WebhookSchema>
export type NormalizedWebhook = z.infer<typeof NormalizedWebhookSchema>

export default WebhookSchema
