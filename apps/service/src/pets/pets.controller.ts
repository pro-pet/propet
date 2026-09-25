import type { Request } from 'express'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, Req, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'
import { PetsService } from './pets.service'

interface AuthenticatedRequest extends Request {
  user: { id: string }
}

@ApiTags('宠物')
@Controller('pets')
export class PetsController {
  constructor(private readonly petsService: PetsService) {}

  @Get('mine')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '查询我的宠物' })
  listMine(@Req() request: AuthenticatedRequest) {
    return this.petsService.list(request.user.id)
  }

  @Get()
  @ApiOperation({ summary: '查询宠物' })
  list(@Query('ownerId') ownerId?: string) {
    return this.petsService.list(ownerId)
  }

  @Get(':id')
  @ApiOperation({ summary: '获取宠物详情' })
  findOne(@Param('id') id: string) {
    return this.petsService.findOne(id)
  }

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增宠物' })
  create(@Body() dto: CreatePetDto, @Req() request: AuthenticatedRequest) {
    return this.petsService.create(request.user.id, dto)
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新我的宠物' })
  update(@Param('id') id: string, @Body() dto: UpdatePetDto, @Req() request: AuthenticatedRequest) {
    return this.petsService.update(id, request.user.id, dto)
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除我的宠物' })
  remove(@Param('id') id: string, @Req() request: AuthenticatedRequest) {
    return this.petsService.remove(id, request.user.id)
  }
}
