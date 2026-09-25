import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { CoreModule } from './common/core.module'
import { findWorkspaceRoot, getEnvFilePaths } from './common/utils/workspace'
import { HealthController } from './health.controller'
import { PostsModule } from './posts/posts.module'
import { PetsModule } from './pets/pets.module'
import { FollowsModule } from './follows/follows.module'
import { PrismaModule } from './prisma/prisma.module'
import { UserModule } from './user/user.module'

const root = findWorkspaceRoot(process.cwd())

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: getEnvFilePaths(root),
    }),
    CoreModule,
    PrismaModule,
    AuthModule,
    UserModule,
    PostsModule,
    PetsModule,
    FollowsModule,
  ],
  controllers: [AppController, HealthController],
  providers: [AppService],
})
export class AppModule {}
