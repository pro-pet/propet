import { BadRequestException, NotFoundException } from '@nestjs/common'
import { PostsService } from './posts.service'

describe('postsService', () => {
  it('does not update a post owned by another user', async () => {
    const prisma = {
      post: {
        updateMany: jest.fn().mockResolvedValue({ count: 0 }),
      },
    }
    const service = new PostsService(prisma as never)

    await expect(service.update('post-id', 'user-id', { title: 'Updated' }))
      .rejects
      .toBeInstanceOf(NotFoundException)
    expect(prisma.post.updateMany).toHaveBeenCalledWith({
      where: { id: 'post-id', authorId: 'user-id' },
      data: { title: 'Updated' },
    })
  })

  it('rejects empty updates', async () => {
    const service = new PostsService({} as never)
    await expect(service.update('post-id', 'user-id', {}))
      .rejects
      .toBeInstanceOf(BadRequestException)
  })
})
