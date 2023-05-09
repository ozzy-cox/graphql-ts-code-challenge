import { ORM } from '@/orm'
import { IPost } from '@/post/entities/IPost'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { PostService } from '@/post/services/PostService'
import { filterOutErrors, filterTruthy } from '@/shared/helpers/utils'
import { every, isEqual, range } from 'lodash-es'

describe('listing posts using dataloader', () => {
  let postRepository: PostRepository
  let postService: PostService
  let posts: IPost[]

  beforeAll(async () => {
    const em = (await ORM.getInstance()).em.fork()
    postRepository = new PostRepository(em)
    postService = new PostService(postRepository)

    posts = (await Promise.all(range(15).map((idx) => postService.createPost(`Post content ${idx}`)))).filter(
      (post): post is IPost => !!post
    )
  })

  test('should list ids for a pagination scheme', async () => {
    const post = posts[0]
    const limit = 3

    const postLoader = postService.postLoader

    const postIds = post && (await postRepository.findNextNPostIdsAfter(limit, post.id))
    const loadedPosts = filterTruthy(filterOutErrors(await postLoader.loadMany(postIds)))

    expect(postIds).toHaveLength(limit)
    expect(loadedPosts).toHaveLength(limit)

    expect(
      every(posts, (post) =>
        isEqual(
          loadedPosts.find((loadedPost) => loadedPost.id === post.id),
          post
        )
      )
    )
  })

  afterAll(async () => {
    ;(await ORM.getInstance()).close()
  })
})
