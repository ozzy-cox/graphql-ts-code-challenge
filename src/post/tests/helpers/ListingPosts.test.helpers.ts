import { IPostRepository } from '@/post/repositories/IPostRepository'
import { PostService } from '@/post/services/PostService'

export const testListingPosts = (repoHook: () => () => IPostRepository) => {
  describe('listing posts', () => {
    const getRepo = repoHook()
    test('should list one post when one post is created', async () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)

      const post = await postService.createPost('Have a nice day')
      const postId = post && post.id
      const posts = await postService.listPosts(5)

      expect(posts && posts.length).toEqual(1)
    })
  })
}
