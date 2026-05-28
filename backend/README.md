# Elysia with Bun runtime

## Getting Started

To get started with this template, simply paste this command into your terminal:

```bash
bun create elysia ./elysia-example
```

## Development

To start the development server run:

```bash
bun run dev
```

Open http://localhost:3000/ with your browser to see the result.

## Prisma (ORM)

- **ORM used**: Prisma (TypeScript)
- **Prisma schema**: [backend/prisma/schema.prisma](prisma/schema.prisma#L1)
- **Generated client**: [backend/generated/prisma/client.ts](generated/prisma/client.ts#L1)
- **Prisma client import**: [backend/config/prisma.ts](config/prisma.ts#L1)
- **Environment variable**: `DATABASE_URL` (example: `postgresql://proy3:secret@db:5432/barbershop`). See root `.env.example`.
- **Common commands**:
  - Install: `bun add prisma @prisma/client`
  - Initialize Prisma: `bunx prisma init`
  - Generate client after schema changes: `bunx prisma generate`
  - Create migration (dev): `bunx prisma migrate dev --name init`
  - Apply migrations (production): `bunx prisma migrate deploy`
  - Sync schema without migrations: `bunx prisma db push`
- **Usage notes**:
  - Use the Prisma client export from [backend/config/prisma.ts](config/prisma.ts#L1) in services and controllers.
  - Prefer `prisma.$transaction([...])` for multi-step operations that must be atomic.
  - Use `prisma.$executeRaw` / `prisma.$queryRaw` to call stored procedures defined in `db/init.sql` or to run complex reports.
  - After changing `schema.prisma`, run `bunx prisma generate` and restart the backend to load generated types.
  - Demo data and users are seeded by `db/init.sql` and `backend/src/modules/auth/setupDemo.ts`.
