import { IPostRepository, PostController } from '@/entities/Post'
import { IReactionRepository, Reaction, ReactionController, ReactionType } from '@/entities/Reaction'
import { Post } from '@/lib/orm/models/Post'
import { getOrm } from '@/lib/orm/orm'
import { MockListableRepository, MockRepository } from '@/repositories/mock/InMemoryRepo'
import config from '@/mikro-orm.config'
import { PostRepository } from '@/repositories/PostRepository'
import { ReactionRepository } from '@/repositories/ReactionRepository'
import { wipeDb } from '@/initDBStateForTest'

const testAddingReactions = (postRepository: IPostRepository, reactionRepository: IReactionRepository) => {
  describe('adding reactions', () => {
    const postContent = "That's a lovely idea."
    const commentContent = "I don't think that is such a great idea."
    const postController = new PostController(postRepository)
    const reactionController = new ReactionController(reactionRepository)

    let post: Post | undefined

    let comment: Post | undefined

    beforeAll(async () => {
      post = await postController.createPost(postContent)
      comment = await postController.createPost(commentContent, post)

      console.log(post)
      console.log(comment)
    })

    test('should add a reaction to a post', async () => {
      const reaction = post && (await reactionController.createReaction(ReactionType.THUMBSUP, post))

      expect(reaction?.type).toEqual(ReactionType.THUMBSUP)
      expect(reaction?.post).toBe(post)
    })

    test('should add a reaction to a comment', async () => {
      const type = ReactionType.THUMBSUP
      const reaction = comment && (await reactionController.createReaction(type, comment))

      expect(comment?.parent).toBe(post)
      expect(reaction?.type).toEqual(type)
      expect(reaction?.post).toBe(comment)
    })
  })
}

const orm = await getOrm(config)
const em = orm.em.fork()
const ormPostRepository = new PostRepository(em)
const ormReactionRepository = new ReactionRepository(em)

describe('adding reactions', () => {
  describe('on mock repo', () => {
    testAddingReactions(new MockListableRepository<Post>(), new MockRepository<Reaction>())
  })

  describe('on orm repo', () => {
    it('repo inited', () => {
      expect(orm).not.toBeFalsy()
      expect(ormPostRepository).not.toBeFalsy()
      expect(ormReactionRepository).not.toBeFalsy()
    })

    beforeEach(async () => {
      await wipeDb()
    })

    testAddingReactions(ormPostRepository, ormReactionRepository)

    afterAll(async () => {
      // await wipeDb()
      await (await getOrm(config)).close()
    })
  })
})
