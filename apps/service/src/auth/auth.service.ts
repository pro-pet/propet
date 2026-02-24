import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, name } = registerDto

    // 检查用户是否已存在
    const existingUser = await this.prisma.user.findUnique({
      where: { email },
    })

    if (existingUser) {
      throw new ConflictException('Email already exists')
    }

    // 加密密码
    const hashedPassword = await bcrypt.hash(password, 10)

    // 创建用户
    const user = await this.prisma.user.create({
      data: {
        email,
        password: hashedPassword,
        name,
      },
    })

    // 生成 JWT token
    const token = this.generateToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    // 查找用户
    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // 验证密码
    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

    // 生成 JWT token
    const token = this.generateToken(user.id, user.email)

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      token,
    }
  }

  private generateToken(userId: string, email: string): string {
    const payload = { sub: userId, email }
    return this.jwtService.sign(payload)
  }

  async validateUser(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return null
    }

    return {
      id: user.id,
      email: user.email,
      name: user.name,
    }
  }
}
