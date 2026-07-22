require('dotenv').config({ path: require('path').resolve(__dirname, '../../.env') });

const Fastify = require('fastify');
const { prisma, validateAndNormalize, isTenantActive, logger: sharedLogger } = require('@abiel/shared')
const { randomUUID } = require('crypto');

async function buildServer() {
  const fastify = Fastify({ logger: { level: process.env.LOG_LEVEL || 'info' } });
  // attach shared logger for convenience
  fastify.decorate('sharedLogger', sharedLogger)

  fastify.get('/health', async () => ({ ok: true }));

  fastify.get('/empresas', async (request, reply) => {
    try {
      const empresas = await prisma.empresa.findMany({
        where: { tenantId: 'tenant-real' },
        select: { id: true, tenantId: true, nombre: true, activa: true }
      });
      return { empresas };
    } catch (error) {
      reply.code(500);
      return { error: error.message };
    }
  });

  fastify.post('/webhook', async (request, reply) => {
    const traceId = randomUUID();
    try {
      const normalized = validateAndNormalize(request.body);
      const active = await isTenantActive(normalized.tenantId);
      if (!active) {
        try {
          const created = await prisma.audit.create({
            data: {
              traceId,
              tenantId: normalized.tenantId,
              eventId: normalized.eventId || null,
              decision: 'rejected',
              reason: 'tenant_inactive',
              payload: normalized
            }
          });
          try { fastify.sharedLogger && fastify.sharedLogger.info({ audit: created }, 'audit.created') } catch {}
          try { require('@abiel/shared').emitLog && require('@abiel/shared').emitLog(created) } catch {}
        } catch (e) {
          fastify.log.error({ err: e }, 'Failed to write audit (rejected)')
        }

        reply.code(403);
        return { status: 'rejected', traceId, decision: 'rejected', reason: 'tenant_inactive' };
      }

      // Enqueue to buffer/orchestrator (placeholder)
      fastify.log.info({ traceId, eventId: normalized.eventId, tenant: normalized.tenantId }, 'webhook.received')

      // persist audit: queued
      try {
        const created = await prisma.audit.create({
          data: {
            traceId,
            tenantId: normalized.tenantId,
            eventId: normalized.eventId || null,
            decision: 'queued',
            reason: null,
            payload: normalized
          }
        });
        try { fastify.sharedLogger && fastify.sharedLogger.info({ audit: created }, 'audit.created') } catch {}
        try { require('@abiel/shared').emitLog && require('@abiel/shared').emitLog(created) } catch {}
      } catch (e) {
        fastify.log.error({ err: e }, 'Failed to write audit (queued)')
      }

      reply.code(202);
      return { status: 'accepted', traceId, decision: 'queued' };
    } catch (err) {
      // persist audit: invalid payload
      try {
        const reason = (err && err.message) ? String(err.message).slice(0, 255) : 'invalid_payload'
        const created = await prisma.audit.create({
          data: {
            traceId,
            tenantId: (request.body && request.body.tenantId) || 'unknown',
            eventId: (request.body && request.body.eventId) || null,
            decision: 'invalid',
            reason,
            payload: request.body || {}
          }
        });
        try { fastify.sharedLogger && fastify.sharedLogger.info({ audit: created }, 'audit.created') } catch {}
        try { require('@abiel/shared').emitLog && require('@abiel/shared').emitLog(created) } catch {}
      } catch (e) {
        fastify.log.error({ err: e }, 'Failed to write audit (invalid)')
      }

      reply.code(400);
      return { status: 'invalid', traceId, error: err.message };
    }
  });

  // Real-time login endpoint (admin token-based)
  fastify.post('/auth/login', async (request, reply) => {
    const traceId = randomUUID();
    try {
      const { adminToken } = request.body || {}
      if (!adminToken) {
        reply.code(400)
        return { status: 'error', traceId, error: 'missing_adminToken' }
      }

      if (adminToken !== process.env.ADMIN_ACCESS_TOKEN) {
        // audit invalid admin token
        try {
          await prisma.audit.create({ data: { traceId, tenantId: 'system', eventId: null, decision: 'rejected', reason: 'invalid_admin_token', payload: { adminToken: 'REDACTED' } } })
        } catch (e) {
          fastify.log.error({ err: e }, 'Failed to write audit (auth rejected)')
        }
        reply.code(401)
        return { status: 'unauthorized', traceId, decision: 'rejected' }
      }

      // Successful admin auth - issue a transient token (traceId) and persist audit
      try {
        const created = await prisma.audit.create({ data: { traceId, tenantId: 'system', eventId: null, decision: 'authenticated', reason: 'admin', payload: { admin: true } } })
        try { fastify.sharedLogger && fastify.sharedLogger.info({ audit: created }, 'audit.created') } catch {}
        try { require('@abiel/shared').emitLog && require('@abiel/shared').emitLog(created) } catch {}
      } catch (e) {
        fastify.log.error({ err: e }, 'Failed to write audit (auth accepted)')
      }

      reply.code(200)
      return { status: 'ok', traceId, token: traceId, role: 'admin' }
    } catch (err) {
      fastify.log.error({ err }, 'auth.login.error')
      reply.code(500)
      return { status: 'error', traceId, error: err.message }
    }
  })

  return fastify;
}

// Admin logs: protected endpoints
async function attachAdminRoutes(fastify) {
  fastify.decorate('verifyAdmin', async (request, reply) => {
    const auth = request.headers.authorization || ''
    const token = auth.startsWith('Bearer ') ? auth.slice(7) : (request.query && request.query.token)
    if (token !== process.env.ADMIN_ACCESS_TOKEN) {
      reply.code(401)
      return false
    }
    return true
  })

  fastify.get('/admin/logs', async (request, reply) => {
    const ok = await fastify.verifyAdmin(request, reply)
    if (!ok) return { error: 'unauthorized' }
    const limit = Number(request.query.limit) || 50
    const logs = await prisma.audit.findMany({ orderBy: { createdAt: 'desc' }, take: limit })
    return { logs }
  })

  fastify.get('/admin/logs/stream', async (request, reply) => {
    const ok = await fastify.verifyAdmin(request, reply)
    if (!ok) return

    reply.raw.setHeader('Content-Type', 'text/event-stream')
    reply.raw.setHeader('Cache-Control', 'no-cache')
    reply.raw.setHeader('Connection', 'keep-alive')
    reply.raw.write('\n')

    const { bus } = require('@abiel/shared')
    const onLog = (entry) => {
      try {
        reply.raw.write(`data: ${JSON.stringify(entry)}\n\n`)
      } catch (e) {}
    }

    bus.on('log', onLog)

    request.raw.on('close', () => {
      bus.off('log', onLog)
    })
  })
}


async function main() {
  const fastify = await buildServer();
  await attachAdminRoutes(fastify);
  const port = Number(process.env.PORT || 5000);
  await fastify.listen({ port, host: '0.0.0.0' });
  console.log(`API listening on http://0.0.0.0:${port}`);
}

  if (require.main === module) {
    main().catch((err) => {
      // Use console here as fastify may not be ready
      console.error(err);
      process.exit(1);
    });
  }

  module.exports = { buildServer };
