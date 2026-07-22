# Arquitectura del proyecto

## Visión general
Este repositorio está orientado a un producto SaaS multi-tenant con un monorepo compuesto por:
- backend: lógica de negocio, orquestación y servicios.
- web-admin: experiencia de administración.
- web-customer: experiencia del cliente.
- shared: contratos, utilidades y tipos compartidos.

## Principios de diseño
- Aislamiento de tenants mediante tenantId obligatorio en los puntos críticos del flujo.
- Separación de responsabilidades entre ingestión, validación, orquestación, IA y respuesta.
- Simplicidad por encima de sobreingeniería.
- Seguridad y trazabilidad como requisitos no negociables.
- Disciplina operativa: cada decisión debe ser coherente, documentada y verificable.

## Modelo operativo del equipo
- Cada conversación debe iniciar con contexto, rol y objetivo claro.
- Cada cambio debe ser ejecutado con orden, criterio y alineación con la arquitectura vigente.
- Cada entrega debe ser trazable a una decisión, un requisito o una observación anterior.
- La coordinación entre roles debe ser fluida, sin solapamientos ni desviaciones.
- Los handoffs deben ser formales, breves y ejecutables para evitar pérdida de contexto.
- Tras cada charla, el secretario debe leer todos los roles, las instrucciones globales, la arquitectura, las decisiones y el feedback, y preparar un pront por rol cuando sea necesario.
- El usuario interactúa con el secretario en lenguaje natural; el secretario traduce esa solicitud al resto del equipo mediante pronts claros y operativos.

## Flujo de negocio
1. Webhook o evento entrante.
2. Validación de empresa activa y permisos.
3. Buffer de espera para desacoplar ingestión y procesamiento.
4. Orquestación del flujo.
5. IA o motor de decisión.
6. Respuesta o publicación del resultado.

## Reglas de mantenimiento
- Cada chat debe leer esta arquitectura antes de actuar.
- Los cambios estructurales deben actualizar este documento.
- Los roles operativos deben consultarlo como fuente de verdad técnica.
- La ejecución debe ser precisa, consistente y alineada con la visión del equipo.

## Mecanismos de mejora continua
- Cada entrega debe cerrar con una verificación simple: ¿se cumplió el objetivo, se respetó el alcance y se dejó trazabilidad?
- Los bloqueos, riesgos y desviaciones deben registrarse en FEEDBACK.md para no perder aprendizajes.
- Cada rol debe tener un criterio de aceptación claro y medible.
- El secretario debe revisar periódicamente si el flujo sigue siendo claro, ágil y suficientemente disciplinado.
