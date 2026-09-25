import type { Prisma } from '@prisma/client'
import { Injectable, NotFoundException } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { CreatePetDto } from './dto/create-pet.dto'
import { UpdatePetDto } from './dto/update-pet.dto'

const petSelection = {
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
} as const

type PetRecord = Prisma.PetGetPayload<{ select: typeof petSelection }>

function serializePet(pet: PetRecord) {
  const { _count, ...item } = pet
  return { ...item, followerCount: _count.followers }
}

function toDate(value: string | undefined) {
  return value === undefined ? undefined : new Date(value)
}

@Injectable()
export class PetsService {
  constructor(private readonly prisma: PrismaService) {}

  async list(ownerId?: string) {
    const pets = await this.prisma.pet.findMany({
      where: ownerId ? { ownerId } : undefined,
      orderBy: [{ createdAt: 'desc' }, { id: 'desc' }],
      take: 100,
      select: petSelection,
    })
    return pets.map(serializePet)
  }

  async findOne(id: string) {
    const pet = await this.prisma.pet.findUnique({ where: { id }, select: petSelection })
    if (!pet)
      throw new NotFoundException('Pet not found')
    return serializePet(pet)
  }

  async create(ownerId: string, dto: CreatePetDto) {
    const pet = await this.prisma.pet.create({
      data: {
        nickname: dto.nickname,
        species: dto.species,
        breed: dto.breed,
        gender: dto.gender,
        birthday: toDate(dto.birthday),
        avatar: dto.avatar,
        ownerId,
      },
      select: petSelection,
    })
    return serializePet(pet)
  }

  async update(id: string, ownerId: string, dto: UpdatePetDto) {
    const data: Prisma.PetUpdateInput = {
      nickname: dto.nickname,
      species: dto.species,
      breed: dto.breed,
      gender: dto.gender,
      birthday: toDate(dto.birthday),
      avatar: dto.avatar,
    }
    const result = await this.prisma.pet.updateMany({ where: { id, ownerId }, data })
    if (result.count === 0)
      throw new NotFoundException('Pet not found')
    return this.findOne(id)
  }

  async remove(id: string, ownerId: string) {
    const result = await this.prisma.pet.deleteMany({ where: { id, ownerId } })
    if (result.count === 0)
      throw new NotFoundException('Pet not found')
    return { id }
  }
}
