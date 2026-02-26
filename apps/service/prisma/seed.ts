import { PrismaClient } from '@prisma/client'
import * as bcrypt from 'bcrypt'

const prisma = new PrismaClient()

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
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
