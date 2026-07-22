export const tenantSnapshot = {
  tenantId: 'tenant-demo',
  companyId: 'company-demo',
  companyStatus: 'active',
  permissions: ['webhook:read', 'templates:write', 'ai:use'],
  traceId: 'trace-001'
};

export const workflowSteps = [
  {
    title: 'Recepción',
    description: 'Webhook y eventos entrantes de WhatsApp.',
    status: 'Activo'
  },
  {
    title: 'Validación',
    description: 'Tenant guard, empresa activa y permisos.',
    status: 'Verificado'
  },
  {
    title: 'Buffer',
    description: 'Acumulación temporal para reducir saturación.',
    status: 'Listo'
  },
  {
    title: 'Orquestación',
    description: 'Decisiones y flujo de IA para responder.',
    status: 'En curso'
  },
  {
    title: 'Respuesta',
    description: 'Publicación del mensaje de salida.',
    status: 'Pendiente'
  },
  {
    title: 'Auditoría',
    description: 'Trazabilidad y registro del flujo.',
    status: 'Disponible'
  }
];
