import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'

const userSummary = {
  id: true,
  name: true,
  avatar: true,
  _count: { select: { followers: true, following: true, posts: true } },
} as const

const petSummary = {
  id: true,
  nickname: true,
  species: true,
  breed: true,
  avatar: true,
  ownerId: true,
  owner: { select: { id: true, name: true, avatar: true } },
  _count: { select: { followers: true } },
} as const

@Injectable()
export class FollowsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(userId: string, type: 'users' | 'pets') {
    if (type === 'pets') {
      const rows = await this.prisma.petFollow.findMany({
        where: { followerId: userId },
        orderBy: { createdAt: 'desc' },
        include: { pet: { select: petSummary } },
      })
      return rows.map(row => ({ ...row.pet, followerCount: row.pet._count.followers }))
    }

    const rows = await this.prisma.userFollow.findMany({
      where: { followerId: userId },
      orderBy: { createdAt: 'desc' },
      include: { following: { select: userSummary } },
    })
    return rows.map(row => ({ ...row.following, followerCount: row.following._count.followers, followingCount: row.following._count.following, postCount: row.following._count.posts }))
  }

  async followUser(followerId: string, followingId: string) {
    if (followerId === followingId)
      throw new BadRequestException('不能关注自己')
    const user = await this.prisma.user.findUnique({ where: { id: followingId }, select: { id: true } })
    if (!user)
      throw new NotFoundException('User not found')
    await this.prisma.userFollow.upsert({
      where: { followerId_followingId: { followerId, followingId } },
      create: { followerId, followingId },
      update: {},
    })
    return { following: true, targetId: followingId, type: 'user' as const }
  }

  async unfollowUser(followerId: string, followingId: string) {
    await this.prisma.userFollow.deleteMany({ where: { followerId, followingId } })
    return { following: false, targetId: followingId, type: 'user' as const }
  }

  async followPet(followerId: string, petId: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id: petId }, select: { id: true } })
    if (!pet)
      throw new NotFoundException('Pet not found')
    await this.prisma.petFollow.upsert({
      where: { followerId_petId: { followerId, petId } },
      create: { followerId, petId },
      update: {},
    })
    return { following: true, targetId: petId, type: 'pet' as const }
  }

  async unfollowPet(followerId: string, petId: string) {
    await this.prisma.petFollow.deleteMany({ where: { followerId, petId } })
    return { following: false, targetId: petId, type: 'pet' as const }
  }
}
