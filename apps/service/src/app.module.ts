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
        join(__dirname, '../../..', `.env.${process.env.NODE_ENV || 'development'}.local`),
        join(__dirname, '../../..', '.env.local'),
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
