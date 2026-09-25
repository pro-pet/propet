import type { INestApplication } from '@nestjs/common'
import type { App } from 'supertest/types'
import { randomUUID } from 'node:crypto'
import { Test } from '@nestjs/testing'
import request from 'supertest'
import { AppModule } from '../src/app.module'
import { PrismaService } from '../src/prisma/prisma.service'

describe('MySQL API integration', () => {
  let app: INestApplication<App>
  let prisma: PrismaService
  let token: string
  let otherToken: string
  let userId: string
  const userIds: string[] = []
  const email = `mysql-${randomUUID()}@example.com`
  const password = 'integration-password'

  beforeAll(async () => {
    const module = await Test.createTestingModule({ imports: [AppModule] }).compile()
    app = module.createNestApplication()
    app.setGlobalPrefix('api')
    await app.init()
    prisma = app.get(PrismaService)

    for (const userEmail of [email, `other-${email}`]) {
      const response = await request(app.getHttpServer())
        .post('/api/auth/register')
        .send({ email: userEmail, password, name: '宠物主人 🐾' })
        .expect(201)
      userIds.push(response.body.data.user.id)
      if (userEmail === email) {
        token = response.body.data.token
        userId = response.body.data.user.id
      }
      else {
        otherToken = response.body.data.token
      }
    }
  })

  afterAll(async () => {
    try {
      if (prisma && userIds.length) {
        await prisma.pet.deleteMany({ where: { ownerId: { in: userIds } } })
        await prisma.user.deleteMany({ where: { id: { in: userIds } } })
      }
    }
    finally {
      await app?.close()
    }
  })

  it('checks database readiness and returns the normal response envelope', async () => {
    await request(app.getHttpServer())
      .get('/api/health')
      .expect(200)
      .expect({ code: 200, message: 'success', data: { status: 'ok' } })
  })

  it('persists users, hashes passwords, and authenticates against MySQL', async () => {
    const stored = await prisma.user.findUniqueOrThrow({ where: { email } })
    expect(stored.name).toBe('宠物主人 🐾')
    expect(stored.password).not.toBe(password)
    expect(stored.gender).toBe('UNKNOWN')

    const login = await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password })
      .expect(201)
    expect(login.body.data.user.id).toBe(userId)
    expect(login.body.data.user.password).toBeUndefined()

    await request(app.getHttpServer())
      .get('/api/auth/me')
      .set('Authorization', `Bearer ${login.body.data.token}`)
      .expect(200)
    await request(app.getHttpServer())
      .post('/api/auth/register')
      .send({ email, password })
      .expect(409)
    await request(app.getHttpServer())
      .post('/api/auth/login')
      .send({ email, password: 'wrong-password' })
      .expect(401)
  })

  it('round-trips post JSON images and Unicode through fresh database connections', async () => {
    const images = ['https://example.com/猫咪.jpg', `https://example.com/${'a'.repeat(300)}.jpg`]
    const created = await request(app.getHttpServer())
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '第一次露营 🐈', content: '和猫咪一起去露营 🌳', images })
      .expect(201)
    const postId = created.body.data.id as string
    expect(created.body.data.images).toEqual(images)

    await prisma.$disconnect()
    await prisma.$connect()
    const stored = await prisma.post.findUniqueOrThrow({ where: { id: postId } })
    expect(stored.images).toEqual(images)
    expect(stored.content).toBe('和猫咪一起去露营 🌳')
    expect(stored.createdAt.toISOString()).toBe(created.body.data.createdAt)
    expect(Math.abs(stored.createdAt.getTime() - Date.now())).toBeLessThan(30_000)

    const detail = await request(app.getHttpServer()).get(`/api/posts/${postId}`).expect(200)
    expect(detail.body.data.images).toEqual(images)
    expect(detail.body.data.author.name).toBe('宠物主人 🐾')
    const list = await request(app.getHttpServer()).get('/api/posts?pageSize=100').expect(200)
    expect(list.body.data.items).toEqual(expect.arrayContaining([expect.objectContaining({ id: postId, images })]))

    await request(app.getHttpServer())
      .patch(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Not the owner' })
      .expect(404)
    await request(app.getHttpServer())
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .expect(404)

    const updated = await request(app.getHttpServer())
      .patch(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '露营归来', images: [] })
      .expect(200)
    expect(updated.body.data.images).toEqual([])
    expect(updated.body.data.content).toBe(stored.content)

    await request(app.getHttpServer())
      .delete(`/api/posts/${postId}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    await request(app.getHttpServer()).get(`/api/posts/${postId}`).expect(404)
  })

  it('defaults missing image lists and enforces request validation', async () => {
    const created = await request(app.getHttpServer())
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: '没有图片', content: '一条文字动态' })
      .expect(201)
    expect(created.body.data.images).toEqual([])

    await request(app.getHttpServer())
      .post('/api/posts')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Invalid images', content: 'Text', images: { url: 'invalid' } })
      .expect(400)
    await request(app.getHttpServer())
      .post('/api/posts')
      .send({ title: 'Unauthorized', content: 'Text' })
      .expect(401)
  })

  it('persists pet relations, enums, long avatars, and UTC dates', async () => {
    const birthday = new Date('2024-01-02T03:04:05.000Z')
    const avatar = `https://example.com/${'b'.repeat(300)}.jpg`
    const pet = await prisma.pet.create({
      data: { nickname: '奶糖 🐈', species: 'cat', gender: 'FEMALE', birthday, avatar, ownerId: userId },
    })
    const stored = await prisma.pet.findUniqueOrThrow({ where: { id: pet.id }, include: { owner: true } })
    expect(stored.birthday).toEqual(birthday)
    expect(stored.avatar).toBe(avatar)
    expect(stored.gender).toBe('FEMALE')
    expect(stored.owner.email).toBe(email)
  })
})
