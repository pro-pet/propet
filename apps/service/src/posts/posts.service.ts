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
  petMentions: {
    include: {
      pet: {
        select: {
          id: true,
          nickname: true,
          species: true,
          breed: true,
          gender: true,
          birthday: true,
          avatar: true,
          ownerId: true,
          owner: { select: { id: true, name: true, avatar: true } },
          _count: { select: { followers: true } },
        },
      },
    },
  },
} as const

type PostWithAuthor = Prisma.PostGetPayload<{ include: typeof postSelection }>
type MentionedPet = Omit<PostWithAuthor['petMentions'][number]['pet'], '_count'> & { followerCount: number }
type PostResponse = Omit<PostWithAuthor, 'images' | 'petMentions'> & {
  images: string[]
  pets: MentionedPet[]
}

function serializePost(post: PostWithAuthor): PostResponse {
  const { petMentions, ...postData } = post
  return {
    ...postData,
    images: Array.isArray(postData.images)
      ? postData.images.filter((image): image is string => typeof image === 'string')
      : [],
    pets: petMentions.map(({ pet }) => {
      const { _count, ...petData } = pet
      return { ...petData, followerCount: _count.followers }
    }),
  }
}

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(query: PaginationDto): Promise<Paginated<PostResponse>> {
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
      items: items.map(serializePost),
      meta: {
        total,
        pageIndex,
        pageSize,
        totalPages: Math.ceil(total / pageSize),
      },
    }
  }

  async findOne(id: string): Promise<PostResponse> {
    const post = await this.prisma.post.findUnique({
      where: { id },
      include: postSelection,
    })
    if (!post)
      throw new NotFoundException('Post not found')
    return serializePost(post)
  }

  async create(authorId: string, dto: CreatePostDto): Promise<PostResponse> {
    const petIds = [...new Set(dto.petIds ?? [])]
    if (petIds.length > 0) {
      const count = await this.prisma.pet.count({ where: { id: { in: petIds } } })
      if (count !== petIds.length)
        throw new BadRequestException('包含不存在的宠物')
    }

    const post = await this.prisma.post.create({
      data: {
        title: dto.title,
        content: dto.content,
        images: dto.images ?? [],
        authorId,
        petMentions: {
          create: petIds.map(petId => ({ petId })),
        },
      },
      include: postSelection,
    })
    return serializePost(post)
  }

  async update(id: string, authorId: string, dto: UpdatePostDto) {
    if (Object.keys(dto).length === 0)
      throw new BadRequestException('At least one field is required')

    const { petIds, ...postData } = dto
    if (petIds !== undefined) {
      const uniquePetIds = [...new Set(petIds)]
      const count = await this.prisma.pet.count({ where: { id: { in: uniquePetIds } } })
      if (count !== uniquePetIds.length)
        throw new BadRequestException('包含不存在的宠物')
    }

    const result = await this.prisma.$transaction(async (tx) => {
      const updated = await tx.post.updateMany({
        where: { id, authorId },
        data: postData,
      })
      if (updated.count > 0 && petIds !== undefined) {
        const uniquePetIds = [...new Set(petIds)]
        await tx.postPetMention.deleteMany({ where: { postId: id } })
        if (uniquePetIds.length > 0)
          await tx.postPetMention.createMany({ data: uniquePetIds.map(petId => ({ postId: id, petId })) })
      }
      return updated
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
