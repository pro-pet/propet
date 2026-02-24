import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator'

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email!: string

  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6)
  password!: string

  @ApiPropertyOptional({ example: 'John' })
  @IsString()
  @IsOptional()
  name?: string
}
