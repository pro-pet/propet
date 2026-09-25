import { config } from 'dotenv'
import { defineConfig } from 'prisma/config'
import { findWorkspaceRoot, getEnvFilePaths } from './src/common/utils/workspace'

const root = findWorkspaceRoot(__dirname)

for (const file of getEnvFilePaths(root)) {
  config({ path: file, quiet: true })
}

export default defineConfig({
  schema: 'prisma/schema.prisma',
  migrations: {
    seed: 'ts-node prisma/seed.ts',
  },
  datasource: {
    url: process.env.DATABASE_URL,
    shadowDatabaseUrl: process.env.SHADOW_DATABASE_URL,
  },
})
