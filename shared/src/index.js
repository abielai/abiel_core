const prismaModule = require('./db');
const { validateAndNormalize } = require('./validators/webhook.js');
const { isTenantActive } = require('./tenantGuard.js');
const { logger, child } = require('./logger.js');
const { bus, emitLog } = require('./logbus.js');

module.exports = {
	prisma: prismaModule.prisma,
	PrismaClient: prismaModule.PrismaClient,
	validarUsuarioEnTenant: prismaModule.validarUsuarioEnTenant,
	validarEmpresaEnTenant: prismaModule.validarEmpresaEnTenant,
	validateAndNormalize,
	isTenantActive,
	logger,
	child
	,bus, emitLog
}
