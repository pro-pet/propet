import { join } from 'node:path'
import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'
import { findWorkspaceRoot } from './src/common/utils/workspace'

const nodeEnv = process.env.NODE_ENV || 'development'
const root = findWorkspaceRoot(__dirname)

for (const file of [`.env.${nodeEnv}.local`, '.env.local', `.env.${nodeEnv}`, '.env']) {
  config({ path: join(root, file) })
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    path: 'prisma/migrations',
  },
  datasource: {
    url: process.env.DIRECT_URL || process.env.DATABASE_URL,
  },
})
