import { Gender } from '@prisma/client'
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { IsDateString, IsEnum, IsOptional, IsString, MaxLength, MinLength } from 'class-validator'

export class CreatePetDto {
  @ApiProperty({ example: '团子' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  nickname!: string

  @ApiProperty({ example: '狗狗' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MinLength(1)
  @MaxLength(40)
  species!: string

  @ApiPropertyOptional({ example: '金毛' })
  @IsOptional()
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @MaxLength(80)
  breed?: string

  @ApiPropertyOptional({ enum: Gender })
  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender

  @ApiPropertyOptional({ example: '2022-04-18' })
  @IsOptional()
  @IsDateString()
  birthday?: string

  @ApiPropertyOptional({ example: 'https://example.com/pet.jpg' })
  @IsOptional()
  @IsString()
  @MaxLength(2048)
  avatar?: string
}
