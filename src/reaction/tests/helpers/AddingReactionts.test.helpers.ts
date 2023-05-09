import { IPostRepository } from '@/post/repositories/IPostRepository'
import { IReactionRepository } from '../../repositories/IReactionRepository'
import { PostService } from '@/post/services/PostService'
import { ReactionType } from '../../entities/IReaction'
import { IPost } from '@/post/entities/IPost'
import { ReactionService } from '../../services/ReactionService'

export const testAddingReactions = (postRepository: IPostRepository, reactionRepository: IReactionRepository) => {
  describe('adding reactions', () => {
    const postContent = "That's a lovely idea."
    const commentContent = "I don't think that is such a great idea."
    const postService = new PostService(postRepository)
    const reactionService = new ReactionService(reactionRepository)

    let post: IPost | undefined

    let comment: IPost | undefined

    beforeAll(async () => {
      post = await postService.createPost(postContent)
      comment = await postService.createPost(commentContent, post)
    })

    test('should add a reaction to a post', async () => {
      const type = ReactionType.THUMBSDOWN
      const reaction = post && (await reactionService.createReaction(type, post))

      expect(reaction?.type).toEqual(type)
      expect(reaction?.post).toBe(post)
    })

    test('should add a reaction to a comment', async () => {
      const type = ReactionType.THUMBSUP
      const reaction = comment && (await reactionService.createReaction(type, comment))

      expect(comment?.post).toBe(post)
      expect(reaction?.type).toEqual(type)
      expect(reaction?.post).toBe(comment)
    })
  })
}
