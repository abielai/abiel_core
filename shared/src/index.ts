/**
 * Shared - Punto de entrada centralizado
 * 
 * Este módulo exporta:
 * - Cliente Prisma (para operaciones de base de datos)
 * - Funciones de validación multi-tenant
 * - Contratos y tipos compartidos
 */

export { prisma, PrismaClient, validarUsuarioEnTenant, validarEmpresaEnTenant } from './db'

export default require('./db')
