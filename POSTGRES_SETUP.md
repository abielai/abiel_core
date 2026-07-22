# Instalación y Configuración de PostgreSQL para Abiel

## Instalación

### Linux (Ubuntu/Debian)

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### macOS (Homebrew)

```bash
brew install postgresql
brew services start postgresql
```

### Windows

Descarga desde [postgresql.org](https://www.postgresql.org/download/windows/).

## Crear base de datos para desarrollo

```bash
# Conectarse como usuario postgres
sudo -u postgres psql

# O en macOS (sin sudo):
psql postgres
```

Dentro del shell de psql:

```sql
-- Crear usuario (reemplaza 'abiel' con tu usuario si prefieres)
CREATE USER abiel WITH PASSWORD 'abiel_dev_password';

-- Crear base de datos
CREATE DATABASE abiel_dev OWNER abiel;

-- Dar permisos completos
GRANT ALL PRIVILEGES ON DATABASE abiel_dev TO abiel;

-- Salir
\q
```

## Configurar variable de entorno

En la raíz del proyecto, copia `.env.local.example` a `.env.local`:

```bash
cp .env.local.example .env.local
```

Edita `.env.local` con tus credenciales:

```env
DATABASE_URL="postgresql://abiel:abiel_dev_password@localhost:5432/abiel_dev"
```

## Verificar conexión

```bash
# Conectarse a la base de datos
psql postgresql://abiel:abiel_dev_password@localhost:5432/abiel_dev

# O con psql directo
psql -U abiel -d abiel_dev -h localhost
```

## Crear migraciones desde el schema

Una vez que hayas configurado PostgreSQL:

```bash
# Generar cliente Prisma
npm run db:generate

# Aplicar migraciones
npm run db:migrate:dev --name initial_schema

# O pushear el schema directamente
npm run db:push
```

## Visualizar datos (Prisma Studio)

```bash
npm run db:studio
```

Se abrirá un navegador en `http://localhost:5555` donde puedes ver y editar datos.

## Limpiar base de datos (⚠️ cuidado, borra todo)

```bash
npm run db:push -- --force-reset
```

## Conexión desde aplicación

El cliente Prisma se inicializa en `shared/src/db.ts` y está disponible en toda la aplicación:

```typescript
import { prisma } from '@abiel/shared'

const usuario = await prisma.usuario.findFirst({
  where: { tenantId, id: usuarioId }
})
```

## Troubleshooting

### "psql: command not found"
Añade PostgreSQL a tu PATH o instálalo correctamente.

### "connection refused"
Asegúrate de que PostgreSQL esté corriendo:
```bash
sudo systemctl status postgresql  # Linux
brew services list                # macOS
```

### "password authentication failed"
Verifica que la contraseña en `.env.local` coincida con la del usuario en PostgreSQL.

### "database does not exist"
Ejecuta nuevamente el comando `CREATE DATABASE` en psql.
