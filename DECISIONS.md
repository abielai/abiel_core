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

## 2026-07-22 10:30
Se formalizó la delegación al responsable de infraestructura para instalar y configurar EasyPanel como proxy inverso, incluyendo el apuntado DNS del subdominio, el puerto interno de la aplicación y la habilitación de SSL en EasyPanel.

## 2026-07-22 10:30
Se formalizó la conducta operativa del rol DevOps: antes de actuar debe revisar obligatoriamente ARCHITECTURE.md, DECISIONS.md, FEEDBACK.md, .github/copilot-instructions.md y el rol correspondiente en .github/roles/devops.md, y, si detecta un riesgo operativo, debe reportarlo para que el secretario lo priorice y canalice adecuadamente.

## 2026-07-22 10:45
Se consolidó la conducta operativa del rol QA: antes de actuar debe leer obligatoriamente ARCHITECTURE.md, DECISIONS.md, FEEDBACK.md, .github/copilot-instructions.md y el rol correspondiente en .github/roles/qa.md; si detecta una brecha o riesgo de calidad, debe registrarlo para que el secretario lo convierta en feedback o en un nuevo pront.

## 2026-07-22 10:50
Se formalizó la conducta operativa del rol Security: antes de actuar debe leer obligatoriamente ARCHITECTURE.md, DECISIONS.md, FEEDBACK.md, .github/copilot-instructions.md y el rol correspondiente en .github/roles/security.md; si detecta una vulnerabilidad o una excepción de seguridad, debe reportarla de inmediato para que el secretario la convierta en prioridad o en feedback.
