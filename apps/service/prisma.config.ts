import { existsSync } from 'node:fs'
import { dirname, join } from 'node:path'
import process from 'node:process'
import { config } from 'dotenv'
import { defineConfig, env as prismaEnv } from 'prisma/config'

const nodeEnv = process.env.NODE_ENV || 'development'

function findWorkspaceRoot(from: string): string {
  let dir = from
  while (dir !== dirname(dir)) {
    if (existsSync(join(dir, 'pnpm-workspace.yaml')))
      return dir
    dir = dirname(dir)
  }
  return from
}

const root = findWorkspaceRoot(__dirname)

// Load environment variables in priority order (matching NestJS ConfigModule)
for (const file of [`.env.${nodeEnv}.local`, '.env.local', `.env.${nodeEnv}`, '.env']) {
  config({ path: join(root, file) })
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    // Use direct connection for CLI operations (migrations, introspection)
    // pgbouncer pooled connections don't support the DDL needed for migrations
    // eslint-disable-next-line turbo/no-undeclared-env-vars
    url: process.env.DIRECT_URL || prismaEnv('DATABASE_URL'),
  },
})
