import { join } from 'node:path'
import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { findWorkspaceRoot } from './common/utils/workspace'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { PrismaModule } from './prisma/prisma.module'

const env = process.env.NODE_ENV || 'development'
const root = findWorkspaceRoot(process.cwd())

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        join(root, `.env.${env}.local`),
        join(root, '.env.local'),
        join(root, `.env.${env}`),
        join(root, '.env'),
      ],
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
