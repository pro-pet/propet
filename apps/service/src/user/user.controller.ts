import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common'
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger'
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard'
import { CreateUserDto } from './dto/create-user.dto'
import { UserService } from './user.service'

@ApiTags('用户')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '新增用户' })
  async create(@Body() dto: CreateUserDto) {
    return this.userService.create(dto)
  }

  @Get(':id')
  @ApiOperation({ summary: '根据ID查询用户' })
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id)
  }

  @Get()
  @ApiOperation({ summary: '查询所有用户' })
  async findAll() {
    return this.userService.findAll()
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除用户' })
  async remove(@Param('id') id: string) {
    return this.userService.remove(id)
  }
}
