# Abiel Monorepo

Este repositorio está organizado como un monorepo con tres aplicaciones principales:

- `api`: backend/API
- `web-admin`: panel de administración
- `web-customer`: experiencia del cliente
- `shared`: utilidades y tipos compartidos

## Estructura propuesta

```text
api/
web-admin/
web-customer/
shared/
package.json
```

## Comandos

- `pnpm install`
- `pnpm dev`
- `pnpm build`
- `pnpm test`

## Pruebas locales

Para ejecutar las pruebas del paquete API desde la raíz del repositorio:

```bash
# 1) Instalar Node.js LTS y pnpm
corepack enable
corepack prepare pnpm@latest --activate

# 2) Instalar dependencias del monorepo
pnpm install

# 3) Ejecutar tests del paquete API
pnpm test
# o directamente:
pnpm --filter @abiel/api test
```

Las pruebas de API se ejecutan también automáticamente en GitHub Actions mediante el workflow de CI.
