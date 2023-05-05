import { IPostRepository } from '../repositories/IPostRepository'
import { PostController } from '../services/PostService'

export const testListingPosts = (postRepository: IPostRepository) => {
  describe('listing posts', () => {
    const postController = new PostController(postRepository)

    test('should list one post when one post is created', async () => {
      const post = await postController.createPost('Have a nice day')
      const postId = post && post.id
      const posts = post && (await postController.listPosts(postId, 5))

      expect(posts && posts.length).toBe(1)
    })
  })
}
