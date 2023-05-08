import { getOrm } from '@/createOrm'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { PostService } from '@/post/services/PostService'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import DataLoader from 'dataloader'

describe('listing posts using dataloader', () => {
  let postRepository: PostRepository

  test('should list ids for a pagination scheme', async () => {
    const em = (await getOrm(config)).em.fork()
    const postRepository = new PostRepository(em)
    const postController = new PostService(postRepository)
    const limit = 3

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

    const postLoader = new DataLoader<number, unknown>(async (keys: readonly number[]) => {
      const posts = await postRepository.findById(keys as Writeable<typeof keys>)

      return keys.map((key) => {
        return posts.find((post) => post.id === key) || undefined
      })
    })

    const postIds = post && (await postRepository.findNextNPostIdsAfter(limit, post.id))

    const posts = postIds && (await postLoader.loadMany(postIds))

    expect(postIds).toHaveLength(limit)
    expect(posts).toHaveLength(limit)
  })
})
