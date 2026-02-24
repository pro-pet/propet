import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)
  private readonly pool: Pool

  constructor(private readonly configService: ConfigService) {
    const connectionString = configService.get<string>('DATABASE_URL')
    if (!connectionString) {
      throw new Error('DATABASE_URL is not defined in environment variables.')
    }

    const pool = new Pool({ connectionString })
    const adapter = new PrismaPg(pool)

    super({ adapter })
    this.pool = pool
  }

  async onModuleInit() {
    await this.$connect()
    this.logger.log('Database connection established')
  }

  async onModuleDestroy() {
    await this.$disconnect()
    await this.pool.end()
    this.logger.log('Database connection closed')
  }
}
