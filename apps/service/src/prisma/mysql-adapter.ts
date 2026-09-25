import { PrismaMariaDb } from '@prisma/adapter-mariadb'

export function createMysqlAdapter(databaseUrl: string) {
  const url = new URL(databaseUrl)
  if (url.protocol !== 'mysql:')
    throw new Error('DATABASE_URL must use the mysql:// protocol')

  // Keep Prisma dates in UTC and support Chinese text and emoji.
  for (const [key, value] of Object.entries({
    charset: 'utf8mb4',
    timezone: '+00:00',
    connectionLimit: '10',
  })) {
    if (!url.searchParams.has(key))
      url.searchParams.set(key, value)
  }

  return new PrismaMariaDb(url.toString())
}
