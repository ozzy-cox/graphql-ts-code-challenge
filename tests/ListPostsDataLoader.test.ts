import { getOrm } from '@/createOrm'
import { IPost } from '@/post/entities/IPost'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { PostService } from '@/post/services/PostService'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import DataLoader from 'dataloader'

describe('listing posts using dataloader', () => {
  let postRepository: PostRepository

  test('should list ids for a pagination scheme', async () => {
    const em = (await getOrm(config)).em.fork()
    const postRepository = new PostRepository(em)
    const postService = new PostService(postRepository)
    const limit = 3

    const post = await postService.createPost('Post content 1')

    await postService.createPost('Post content 2')
    await postService.createPost('Post content 3')
    await postService.createPost('Post content 4')
    await postService.createPost('Post content 5')
    await postService.createPost('Post content 6')
    await postService.createPost('Post content 7')
    await postService.createPost('Post content 8')
    await postService.createPost('Post content 9')
    await postService.createPost('Post content 10')
    await postService.createPost('Post content 11')
    await postService.createPost('Post content 12')

    const postLoader = new DataLoader<IPost['id'], unknown>(async (keys) => {
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
