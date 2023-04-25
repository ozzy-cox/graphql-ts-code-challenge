import { Post, PostController } from '@/entities/Post'
import { InMemoryPostRepository } from '@/repositories/EntityRepository'
import { Repository } from '@/repositories/RepositoryInterface'
import { assert } from 'console'

export const testCreatingComments = (postRepository: Repository<Post>) => {
  describe('creating comments', () => {
    test('should create a comment on a post', async () => {
      const commentContent = 'I fully agree with that statement'
      const postController = new PostController(postRepository)
      // There should be a post
      const post = await postController.createPost('Lorem ipsum dolor sit amet')
      const comment = await postController.createPost(commentContent, 0)
      expect(post).not.toBeNull()
      expect(comment).not.toBeNull()
      expect(comment).toHaveProperty('content')
      expect(comment && comment.content).toEqual(commentContent)
      expect(comment && comment.parentId).toBe(post && post.id)
    })
  })
}

describe('comment operations', () => {
  describe('on in memory repo', () => {
    testCreatingComments(new InMemoryPostRepository())
  })
})
