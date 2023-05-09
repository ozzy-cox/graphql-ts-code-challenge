import { IPost } from '@/post/entities/IPost'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import { PostService } from '@/post/services/PostService'

export const testCreatingComments = (repoHook: () => () => IPostRepository) => {
  const getRepo = repoHook()
  describe('creating comments', () => {
    let post: IPost | undefined

    beforeEach(async () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)
      post = await postService.createPost('Lorem ipsum dolor sit amet')
    })

    test('should create a comment on a post', async () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)
      const commentContent = 'I fully agree with that statement'

      // There should be a post
      const comment = post && (await postService.createPost(commentContent, post))
      expect(post).not.toBeNull()
      expect(comment).not.toBeNull()
      expect(comment).toHaveProperty('content')
      expect(comment && comment.content).toEqual(commentContent)
      expect(comment && comment.post).toBe(post)
    })

    test('should create a comment on a comment', async () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)
      const commentContent = "That's a lovely idea."

      const comment = post && (await postService.createPost(commentContent, post))

      const commentTwoContent = "I don't think that's such a great idea"

      const commentOnComment = comment && (await postService.createPost(commentTwoContent, comment))

      expect(comment).not.toBeNull()
      expect(comment).toHaveProperty('content')
      expect(comment && comment.content).toEqual(commentContent)

      expect(commentOnComment).not.toBeNull()
      expect(commentOnComment).toHaveProperty('content')
      expect(commentOnComment && commentOnComment.content).toEqual(commentTwoContent)

      expect(commentOnComment && commentOnComment.post).toBe(comment)
    })
  })
}
