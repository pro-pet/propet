import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        // .local 文件优先（gitignored，存放个人/敏感配置）
        join(__dirname, '../../..', `.env.${process.env.NODE_ENV || 'development'}.local`),
        join(__dirname, '../../..', '.env.local'),
        // 共享环境配置（提交到 git）
        join(__dirname, '../../..', `.env.${process.env.NODE_ENV || 'development'}`),
        join(__dirname, '../../..', '.env'),
      ],
    }),
    PrismaModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
