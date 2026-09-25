import type { Request } from 'express'
import { Controller, Delete, Get, Param, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { FollowsService } from './follows.service'

interface AuthenticatedRequest extends Request {
  user: { id: string }
}

@ApiTags('关注')
@Controller()
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class FollowsController {
  constructor(private readonly followsService: FollowsService) {}

  @Get('following')
  @ApiOperation({ summary: '查询我的关注' })
  list(@Query('type') type: 'users' | 'pets' = 'users', @Req() request: AuthenticatedRequest) {
    return this.followsService.list(request.user.id, type === 'pets' ? 'pets' : 'users')
  }

  @Post('users/:id/follow')
  @ApiOperation({ summary: '关注用户' })
  followUser(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.followsService.followUser(request.user.id, id)
  }

  @Delete('users/:id/follow')
  @ApiOperation({ summary: '取消关注用户' })
  unfollowUser(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.followsService.unfollowUser(request.user.id, id)
  }

  @Post('pets/:id/follow')
  @ApiOperation({ summary: '关注宠物' })
  followPet(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.followsService.followPet(request.user.id, id)
  }

  @Delete('pets/:id/follow')
  @ApiOperation({ summary: '取消关注宠物' })
  unfollowPet(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.followsService.unfollowPet(request.user.id, id)
  }
}
