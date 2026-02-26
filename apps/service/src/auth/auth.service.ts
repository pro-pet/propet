import { Injectable, UnauthorizedException } from '@nestjs/common'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { PrismaService } from '../prisma/prisma.service'
import { UserService } from '../user/user.service'
import { LoginDto } from './dto/login.dto'
import { RegisterDto } from './dto/register.dto'

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  async register(registerDto: RegisterDto) {
    const user = await this.userService.create(registerDto)
    const token = this.generateToken(user.id, user.email)
    return { user, token }
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto

    const user = await this.prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }

    const isPasswordValid = await bcrypt.compare(password, user.password)

    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials')
    }

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
      select: { id: true, email: true, name: true },
    })

    return user || null
  }
}
