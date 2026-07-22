const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function validarUsuarioEnTenant(tenantId, usuarioId) {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { tenantId: true }
  });

  return usuario?.tenantId === tenantId;
}

async function validarEmpresaEnTenant(tenantId, empresaId) {
  const empresa = await prisma.empresa.findFirst({
    where: {
      id: empresaId,
      tenantId
    },
    select: { id: true }
  });

  return !!empresa;
}

module.exports = {
  prisma,
  PrismaClient,
  validarUsuarioEnTenant,
  validarEmpresaEnTenant
};
