import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { createMysqlAdapter } from '../src/prisma/mysql-adapter'

const databaseUrl = process.env.DATABASE_URL
if (!databaseUrl)
  throw new Error('DATABASE_URL is required. Run the seed with pnpm db:seed.')

const prisma = new PrismaClient({ adapter: createMysqlAdapter(databaseUrl) })

async function main() {
  const hashedPassword = await bcrypt.hash('password123', 10)

  const user = await prisma.user.upsert({
    where: { email: 'test@propet.com' },
    update: {},
    create: {
      email: 'test@propet.com',
      password: hashedPassword,
      name: '测试用户',
    },
  })

  // eslint-disable-next-line no-console
  console.log('Seeded user:', user.id, user.email)
}

main()
  .catch((e) => {
    console.error(e)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
