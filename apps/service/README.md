# ProPet API

NestJS 11 + Prisma 7 + MySQL. Run the commands below from the repository root.

```bash
pnpm install
pnpm db:up
pnpm db:generate
pnpm db:deploy
pnpm db:seed
pnpm --filter @propet/service dev
```

The API listens on port 3001 with the `/api` prefix. Development Swagger docs are at
`/docs`; `/api/health` checks MySQL connectivity. Docker starts the compiled server
at `dist/src/main.js` after the migration job succeeds. SIGTERM closes the database pool.

Prisma uses its official `@prisma/adapter-mariadb` adapter, which supports MySQL.
`DATABASE_URL` must use `mysql://`. Connections default to UTF-8 (`utf8mb4`) and UTC.
Post images use a MySQL JSON column and remain `string[]` in API responses.

Active migrations are in `prisma/migrations`. For local schema changes, run
`pnpm db:migrate --name change_name`, followed by `pnpm db:generate`. Deployments use
`pnpm db:deploy`; they never reset databases or seed demo accounts automatically.
`pnpm db:seed` is idempotent and creates `test@propet.com` / `password123` when absent.

## Tests

```bash
pnpm --filter @propet/service test --runInBand
DATABASE_URL='mysql://propet:propet_dev_password@127.0.0.1:3306/propet_test' pnpm db:deploy
TEST_DATABASE_URL='mysql://propet:propet_dev_password@127.0.0.1:3306/propet_test' pnpm --filter @propet/service test:e2e --runInBand
```

Integration tests require an explicitly selected database with migrations applied.
They exercise real registration/login, post CRUD and permissions, JSON image storage,
Unicode and UTC dates, and remove only the users and related records they create.

See the root [README](../../README.md) or [中文文档](../../README.zh-CN.md) for environment
precedence, Docker startup, data persistence and migration guidance.
