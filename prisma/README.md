# Prisma - Base de Datos Multi-Tenant

## Descripción

Este directorio contiene la configuración de Prisma para la base de datos PostgreSQL de Abiel, con soporte completo para aislamiento multi-tenant.

## Estructura

```
prisma/
├── schema.prisma    # Esquema de base de datos con modelos
└── migrations/      # Migraciones de Prisma (generadas automáticamente)
```

## Configuración

### 1. Variables de entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/abiel_dev"
```

Ver [.env.example](./../.env.example) para más detalles.

### 2. Instalar dependencias

```bash
npm install @prisma/client prisma
# o
pnpm install -D @prisma/client prisma
```

### 3. Crear migraciones

Después de cambiar el schema:

```bash
npx prisma migrate dev --name descripcion_del_cambio
```

Para producción:

```bash
npx prisma migrate deploy
```

### 4. Generar cliente Prisma

```bash
npx prisma generate
```

## Modelos

### Empresa
- **Raíz del tenant**: Cada cliente es una empresa.
- **tenantId**: Identificador único del cliente (obligatorio).
- **Relaciones**: Usuarios, Mensajes.

### Usuario
- **Vinculado a Empresa**: Un usuario pertenece a una única empresa.
- **tenantId**: Heredado del contexto (obligatorio).
- **Índices únicos**: Por tenant + email.

### Mensaje
- **Transaccional**: Datos del cliente.
- **tenantId**: Garantiza aislamiento.
- **Índices compuestos**: Para consultas rápidas por tenant.

## Reglas de Aislamiento

⚠️ **CRÍTICO**: Todo filtro de lectura o escritura debe incluir `tenantId`.

### ✅ Correcto
```typescript
const usuario = await prisma.usuario.findFirst({
  where: {
    id: usuarioId,
    tenantId: tenantId  // ✅ SIEMPRE incluir
  }
})
```

### ❌ Incorrecto
```typescript
const usuario = await prisma.usuario.findUnique({
  where: { id: usuarioId }  // ❌ SIN validación de tenant
})
```

## Uso

### Cliente Prisma Centralizado

Importa desde `@abiel/shared`:

```typescript
import { prisma, validarUsuarioEnTenant } from '@abiel/shared'

// Operación con validación
const usuarioValido = await validarUsuarioEnTenant(tenantId, usuarioId)
if (!usuarioValido) throw new Error('Acceso denegado')

const usuario = await prisma.usuario.findFirst({
  where: { id: usuarioId, tenantId }
})
```

### Ejemplo CRUD

Ver [../api/src/crud.example.ts](../api/src/crud.example.ts) para operaciones completas de lectura y escritura.

## Mejores Prácticas

1. **Validar tenantId primero**: Antes de cualquier operación, valida que el usuario pertenece al tenant.
2. **Usar transacciones**: Para operaciones que tocan múltiples tablas.
3. **Índices compuestos**: Todos los índices deben incluir `tenantId`.
4. **No inferir tenantId**: Nunca asumas el tenant desde una relación anterior; valida explícitamente.

## Monitoreo y Debugging

### Ver logs de Prisma

```bash
DATABASE_DEBUG=true npx ts-node script.ts
```

### Ejecutar ejemplo CRUD

```bash
npm run crud:example
# o
npx ts-node -r tsconfig-paths/register api/src/crud.example.ts
```

## Documentación

- [Prisma Docs](https://www.prisma.io/docs/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)
- [Schema de Prisma](./schema.prisma)
