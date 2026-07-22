/**
 * Shared - Punto de entrada centralizado
 * 
 * Este módulo exporta:
 * - Cliente Prisma (para operaciones de base de datos)
 * - Funciones de validación multi-tenant
 * - Contratos y tipos compartidos
 */

const db = require('./db');

module.exports = db;
module.exports.default = db;
module.exports.prisma = db.prisma;
module.exports.PrismaClient = db.PrismaClient;
module.exports.validarUsuarioEnTenant = db.validarUsuarioEnTenant;
module.exports.validarEmpresaEnTenant = db.validarEmpresaEnTenant;
