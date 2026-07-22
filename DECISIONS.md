# Registro de decisiones

Este archivo conserva el historial de decisiones del proyecto. No se debe borrar ni reescribir texto previo.

## 2026-07-22 09:00
Se estableció un modelo de orquestación por roles para cada chat, con lectura obligatoria de ARCHITECTURE.md, .github/copilot-instructions.md, DECISIONS.md y FEEDBACK.md antes de actuar.

## 2026-07-22 09:15
Se formalizó un modelo de trabajo técnico disciplinado, con coordinación entre roles, trazabilidad de decisiones y ejecución precisa, similar a una operación alineada con estándares de excelencia y orden.

## 2026-07-22 09:30
Se establecieron reglas de handoff entre roles para que cualquier solicitud compleja pueda pasar de un solo chat al secretario de arquitectura o al equipo técnico con contexto completo, prioridad, alcance y criterio de aceptación.

## 2026-07-22 10:00
Se adoptó un estándar operativo más fuerte para el equipo: cada rol debe responder con objetivo, acción, bloqueo, evidencia y siguiente paso; y toda tarea debe tener criterio de aceptación antes de ejecutarse.

## 2026-07-22 10:15
Se estableció como regla operativa que el usuario hablará en lenguaje natural con el secretario, y este será quien traduzca la solicitud al resto del equipo mediante pronts claros y ejecutables.

## 2026-07-22 11:00
Se definió la arquitectura propuesta para Abiel Core Backend como un backend modular dentro del monorepo, con aislamiento de tenants obligatorio en servicios, base de datos y flujos de mensajería; contratos y validadores centralizados en shared; y un flujo lineal de webhook, validación de empresa activa, orquestación y respuesta con trazabilidad.

## 2026-07-22 11:15
Se definieron los contratos mínimos del flujo de mensajería para Abiel Core: entrada del webhook con campos obligatorios y opcionales, contexto de validación con tenant, empresa y estado de activación, y salida de orquestación con trazabilidad mínima para auditoría y procesamiento.

## 2026-07-22 10:30
Se formalizó la delegación al responsable de infraestructura para instalar y configurar EasyPanel como proxy inverso, incluyendo el apuntado DNS del subdominio, el puerto interno de la aplicación y la habilitación de SSL en EasyPanel.

## 2026-07-22 10:30
Se formalizó la conducta operativa del rol DevOps: antes de actuar debe revisar obligatoriamente ARCHITECTURE.md, DECISIONS.md, FEEDBACK.md, .github/copilot-instructions.md y el rol correspondiente en .github/roles/devops.md, y, si detecta un riesgo operativo, debe reportarlo para que el secretario lo priorice y canalice adecuadamente.

## 2026-07-22 10:45
Se consolidó la conducta operativa del rol QA: antes de actuar debe leer obligatoriamente ARCHITECTURE.md, DECISIONS.md, FEEDBACK.md, .github/copilot-instructions.md y el rol correspondiente en .github/roles/qa.md; si detecta una brecha o riesgo de calidad, debe registrarlo para que el secretario lo convierta en feedback o en un nuevo pront.

## 2026-07-22 10:50
Se formalizó la conducta operativa del rol Security: antes de actuar debe leer obligatoriamente ARCHITECTURE.md, DECISIONS.md, FEEDBACK.md, .github/copilot-instructions.md y el rol correspondiente en .github/roles/security.md; si detecta una vulnerabilidad o una excepción de seguridad, debe reportarla de inmediato para que el secretario la convierta en prioridad o en feedback.

## 2026-07-22 11:05
Se fijó la topología de ejecución del entorno: la API correrá en el puerto 5000, el web admin en el puerto 5001 y el web customer en el puerto 5002. Todas las aplicaciones deben estar disponibles en el entorno y consumir la información desde esos puntos de acceso asignados.

## 2026-07-22 14:30 (Database Guardian)
Se implementó la base de datos PostgreSQL con Prisma siguiendo arquitectura multi-tenant:
- **Schema Prisma** en `prisma/schema.prisma` con tres modelos: Empresa (raíz del tenant), Usuario (vinculado a Empresa), Mensaje (transaccional).
- **Aislamiento garantizado**: Todos los modelos contienen `tenantId` obligatorio; índices compuestos (`tenantId + id`) previenen fugas de datos.
- **Cliente centralizado**: Exportado en `shared/src/db.ts` con funciones de validación (`validarUsuarioEnTenant`, `validarEmpresaEnTenant`).
- **CRUD de prueba**: Implementado en `api/src/crud.example.ts` con operaciones completas (crear, leer, actualizar, eliminar) respetando aislamiento.
- **Documentación**: Guía en `prisma/README.md` con configuración, migraciones y mejores prácticas.
- **Validaciones**: Todo filtro incluye `tenantId`; se valida acceso antes de cada operación; relaciones son explícitas sin inferencias.
- **Próximos pasos**: Generar cliente Prisma (`npx prisma generate`), ejecutar migraciones en PostgreSQL local, y validar CRUD con datos reales.

## 2026-07-22 15:00 (Arquitectura QA review)
Se revisó el handoff de QA sobre tests del paquete API y CRUD multi-tenant con evidencia ejecutada en local. Resultado verificado:
- La suite de tests del paquete API pasó: 1 archivo, 5 tests, 0 fallos.
- El diseño actual aplica validaciones de acceso previas a operaciones de escritura y filtra por `tenantId` en lecturas, lo que es coherente con la arquitectura vigente.
- No se detectó una falla arquitectónica crítica que obligue a bloquear el merge, pero sí riesgos operativos menores relacionados con la dependencia de mocks y con la necesidad de asegurar que las operaciones destructivas (`update`/`delete`) incluyan la validación de tenant en la cláusula `where` o en un mecanismo de acceso equivalente.

Decisión arquitectónica:
- Se aprueba el cambio como "Minor changes" con observaciones de seguimiento, sin requerir un cambio de arquitectura mayor ni un ticket de diseño inmediato.
- Se recomienda cerrar las observaciones en una siguiente iteración con pruebas de integración reales y validaciones reforzadas en los puntos de escritura.

## 2026-07-22 15:15
Se estableció como estándar de identidad para toda la base de datos el uso de UUID en lugar de enteros secuenciales o identificadores basados en texto no normalizado.
- Todas las entidades persistentes deberán usar UUID como identificador primario.
- El módulo shared incorporará un componente dedicado para generación, normalización y validación de UUID.
- Este criterio aplica a modelos de base de datos, contratos compartidos y operaciones de negocio del backend.

## 2026-07-22 15:30
Se definió un modelo de datos inicial para la API de mensajería con las tablas Empresa, Usuario, Mensaje, Buffer y Plantilla.
- La tabla Empresa almacenará la configuración de la integración de WhatsApp vinculada a la empresa.
- El modelo inicial usa UUID como identificador primario y mantiene `tenantId` como requisito para el aislamiento multi-tenant.
- Buffer se incorpora como capa temporal para desacoplar ingestión y orquestación, mientras que Plantilla soporta respuestas predefinidas del canal.
