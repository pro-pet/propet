import type { Request } from 'express'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { PaginationDto } from '../common/dto/pagination.dto'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'
import { PostsService } from './posts.service'

interface AuthenticatedRequest extends Request {
  user: { id: string }
}

@ApiTags('帖子')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  @Get()
  @ApiOperation({ summary: '分页查询帖子' })
  list(@Query() query: PaginationDto) {
    return this.postsService.list(query)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取帖子详情' })
  findOne(@Param('id') id: string) {
    return this.postsService.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布帖子' })
  create(@Body() dto: CreatePostDto, @Req() request: AuthenticatedRequest) {
    return this.postsService.create(request.user.id, dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新自己的帖子' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdatePostDto,
    @Req() request: AuthenticatedRequest,
  ) {
    return this.postsService.update(id, request.user.id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除自己的帖子' })
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.postsService.remove(id, request.user.id)
  }
}
