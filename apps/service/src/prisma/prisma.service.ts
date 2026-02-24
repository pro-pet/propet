import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PrismaPg } from '@prisma/adapter-pg'
import { PrismaClient } from '@prisma/client'
import { Pool } from 'pg'

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(PrismaService.name)
  private readonly pool: Pool

  constructor(configService: ConfigService) {
    const connectionString = configService.getOrThrow<string>('DATABASE_URL')
    const pool = new Pool({ connectionString })

    super({ adapter: new PrismaPg(pool) })
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
