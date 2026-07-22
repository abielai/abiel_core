import { beforeAll, afterAll, describe, it, expect } from 'vitest'
import { PrismaClient } from '@prisma/client'

import * as serverMod from '../src/server'
const { buildServer } = serverMod

describe('Webhook integration tests', () => {
  let fastify: any
  const prisma = new PrismaClient()

  beforeAll(async () => {
    // ensure test tenant exists
    await prisma.empresa.createMany({ data: [{ tenantId: 'tenant-int', nombre: 'Tenant Int', activa: true }] }).catch(() => {})
    fastify = await buildServer()
    await fastify.ready()
  })

  afterAll(async () => {
    try {
      await fastify.close()
    } catch {}
    await prisma.empresa.deleteMany({ where: { tenantId: 'tenant-int' } }).catch(() => {})
    await prisma.$disconnect()
  })

  it('accepts a valid webhook and records audit', async () => {
    const payload = {
      tenantId: 'tenant-int',
      provider: 'whatsapp',
      eventId: 'evt-int-1',
      timestamp: new Date().toISOString(),
      customerId: 'cust-1',
      conversationId: 'conv-1',
      message: { text: 'hola' },
      channel: { from: '123', to: '456' }
    }

    const res = await fastify.inject({ method: 'POST', url: '/webhook', payload })
    expect(res.statusCode).toBe(202)
    const body = JSON.parse(res.payload)
    expect(body).toHaveProperty('traceId')

    const audit = await prisma.audit.findFirst({ where: { traceId: body.traceId } })
    expect(audit).not.toBeNull()
    expect(audit?.decision).toBe('queued')
  })

  it('rejects when tenant inactive and records audit', async () => {
    // create inactive tenant
    await prisma.empresa.create({ data: { tenantId: 'tenant-inactive', nombre: 'Inactive', activa: false } })
    const payload = {
      tenantId: 'tenant-inactive',
      provider: 'whatsapp',
      eventId: 'evt-int-2',
      timestamp: new Date().toISOString(),
      customerId: 'cust-2',
      conversationId: 'conv-2',
      message: { text: 'hola' },
      channel: { from: '123', to: '456' }
    }

    const res = await fastify.inject({ method: 'POST', url: '/webhook', payload })
    expect(res.statusCode).toBe(403)
    const body = JSON.parse(res.payload)
    expect(body.decision).toBe('rejected')

    const audit = await prisma.audit.findFirst({ where: { traceId: body.traceId } })
    expect(audit).not.toBeNull()
    expect(audit?.decision).toBe('rejected')
  })

  it('records invalid payloads as audit', async () => {
    const res = await fastify.inject({ method: 'POST', url: '/webhook', payload: { bad: 'payload' } })
    expect(res.statusCode).toBe(400)
    const body = JSON.parse(res.payload)
    expect(body.status).toBe('invalid')

    const audit = await prisma.audit.findFirst({ where: { traceId: body.traceId } })
    expect(audit).not.toBeNull()
    expect(audit?.decision).toBe('invalid')
  })
})
