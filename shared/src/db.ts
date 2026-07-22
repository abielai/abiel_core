/**
 * Cliente centralizado de Prisma
 * 
 * Ubicación: shared/src/db.ts
 * Propósito: Exportar una instancia única de Prisma para toda la aplicación.
 * 
 * Reglas de aislamiento multi-tenant:
 * - Nunca usar consultas sin filtrar por tenantId
 * - Validar tenantId en el contexto de la solicitud antes de cualquier operación
 * - Usar tipos del cliente de Prisma para seguridad de tipos
 */

import { PrismaClient } from '@prisma/client'

// Instancia única del cliente Prisma (patrón singleton)
const prisma = new PrismaClient()

export { prisma, PrismaClient }

/**
 * Utility: Validar que el usuario pertenece al tenant
 * Uso: Llamar antes de cualquier operación de base de datos
 * 
 * @param tenantId - El tenant del contexto actual
 * @param usuarioId - El usuario que intenta acceder
 * @returns {Promise<boolean>} True si el usuario pertenece al tenant
 */
export async function validarUsuarioEnTenant(
  tenantId: string,
  usuarioId: string
): Promise<boolean> {
  const usuario = await prisma.usuario.findUnique({
    where: { id: usuarioId },
    select: { tenantId: true }
  })

  return usuario?.tenantId === tenantId
}

/**
 * Utility: Validar que la empresa pertenece al tenant
 * Uso: Validación de acceso antes de operaciones
 * 
 * @param tenantId - El tenant del contexto actual
 * @param empresaId - La empresa a validar
 * @returns {Promise<boolean>} True si la empresa pertenece al tenant
 */
export async function validarEmpresaEnTenant(
  tenantId: string,
  empresaId: string
): Promise<boolean> {
  const empresa = await prisma.empresa.findFirst({
    where: {
      id: empresaId,
      tenantId: tenantId
    },
    select: { id: true }
  })

  return !!empresa
}

export default prisma
