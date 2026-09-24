import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { Transform } from 'class-transformer'
import { ArrayMaxSize, IsArray, IsNotEmpty, IsString, MaxLength, ValidateIf } from 'class-validator'

export class CreatePostDto {
  @ApiProperty({ example: '第一次带猫咪去露营' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(120)
  title!: string

  @ApiProperty({ example: '准备了这些东西，整个过程很顺利。' })
  @Transform(({ value }) => typeof value === 'string' ? value.trim() : value)
  @IsString()
  @IsNotEmpty()
  @MaxLength(5000)
  content!: string

  @ApiPropertyOptional({ type: [String], maxItems: 12 })
  @ValidateIf((_object, value) => value !== undefined)
  @IsArray()
  @ArrayMaxSize(12)
  @IsString({ each: true })
  @MaxLength(2048, { each: true })
  images?: string[]
}
