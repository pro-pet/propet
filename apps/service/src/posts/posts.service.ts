import type { Prisma } from '@prisma/client'
import type { Paginated } from '../common/dto/pagination.dto'
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PaginationDto } from '../common/dto/pagination.dto'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePostDto } from './dto/create-post.dto'
import { UpdatePostDto } from './dto/update-post.dto'

const postSelection = {
  author: {
    select: { id: true, name: true, avatar: true },
  },
} as const

type PostWithAuthor = Prisma.PostGetPayload<{ include: typeof postSelection }>

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: PaginationDto): Promise<Paginated<PostWithAuthor>> {
    const { pageIndex, pageSize } = query
    const skip = pageIndex * pageSize
    const [items, total] = await Promise.all([
      this.prisma.post.findMany({
        skip,
        take: pageSize,
        orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
        include: postSelection,
      }),
      this.prisma.post.count(),
    ])

    return {
      items,
      meta: {
        total,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  async findOne(id: string): Promise<PostWithAuthor> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postSelection,
    })
    if (!post)
      throw new NotFoundException('Post not found')
    return post
  }

  create(authorId: string, dto: CreatePostDto): Promise<PostWithAuthor> {
    return this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        images: dto.images ?? [],
        authorId,
      },
      include: postSelection,
    })
  }

  async update(id: string, authorId: string, dto: UpdatePostDto) {
    if (Object.keys(dto).length === 0)
      throw new BadRequestException('At least one field is required')

    const result = await this.prisma.post.updateMany({
      where: { id, authorId },
      data: dto,
    })
    if (result.count === 0)
      throw new NotFoundException('Post not found')

    return this.findOne(id)
  }

  async remove(id: string, authorId: string) {
    const result = await this.prisma.post.deleteMany({ where: { id, authorId } })
    if (result.count === 0)
      throw new NotFoundException('Post not found')
    return { id }
  }
}
