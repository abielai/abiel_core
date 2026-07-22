const { prisma } = require('./db')

async function isTenantActive(tenantId) {
  const empresa = await prisma.empresa.findFirst({
    where: { tenantId: tenantId, activa: true },
    select: { id: true }
  })
  return !!empresa
}

module.exports = { isTenantActive }
