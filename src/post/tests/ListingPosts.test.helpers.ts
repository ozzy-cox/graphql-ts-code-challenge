import { IPostRepository } from '../repositories/IPostRepository'
import { PostService } from '../services/PostService'

export const testListingPosts = (repoHook: () => () => IPostRepository) => {
  describe('listing posts', () => {
    const getRepo = repoHook()
    test('should list one post when one post is created', async () => {
      const postRepository = getRepo()
      const postController = new PostService(postRepository)

      const post = await postController.createPost('Have a nice day')
      const postId = post && post.id
      const posts = await postController.listPosts(5)

      expect(posts && posts.length).toEqual(1)
    })
  })
}
