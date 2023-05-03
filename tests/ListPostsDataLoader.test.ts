import { getOrm } from '@/lib/orm/orm'
import { PostRepository } from '@/repositories/PostRepository'
import config from '@/mikro-orm-test.config'
import { Post } from '@/lib/orm/models/Post'
import { PostController } from '@/entities/Post'

describe('listing posts using dataloader', () => {
  let postRepository: PostRepository

  beforeAll(async () => {
    const em = (await getOrm(config)).em.fork()
    postRepository = new PostRepository(em)
  })

  test('should list ids for a pagination scheme', async () => {
    const postController = new PostController(postRepository)
    const limit = 3
    const cursor = 1 // TODO All pagination should be made with cursors

    const post = await postController.createPost('Post content 1')

    await postController.createPost('Post content 2')
    await postController.createPost('Post content 3')
    await postController.createPost('Post content 4')
    await postController.createPost('Post content 5')
    await postController.createPost('Post content 6')
    await postController.createPost('Post content 7')
    await postController.createPost('Post content 8')
    await postController.createPost('Post content 9')
    await postController.createPost('Post content 10')
    await postController.createPost('Post content 11')
    await postController.createPost('Post content 12')

    const postIds = post && (await postRepository.findByIdAndSelectIds(cursor, limit))

    expect(postIds).toHaveLength(limit)
  })
})
