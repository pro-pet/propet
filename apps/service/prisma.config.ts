import { config } from "dotenv"
import { join } from "path"
import { defineConfig } from "prisma/config"

const env = process.env.NODE_ENV || "development"
const root = join(__dirname, "../..")

// Load environment variables in priority order (matching NestJS ConfigModule)
for (const file of [`.env.${env}.local`, ".env.local", `.env.${env}`, ".env"]) {
  config({ path: join(root, file) })
}

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    // Use direct connection for CLI operations (migrations, introspection)
    // pgbouncer pooled connections don't support the DDL needed for migrations
    url: process.env["DIRECT_URL"] || process.env["DATABASE_URL"],
  },
})
