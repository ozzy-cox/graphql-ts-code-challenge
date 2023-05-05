import { MockListableRepository, MockRepository } from '@/repositories/mock/InMemoryRepo'
import { Context } from './context'
import { PostController } from './post/services/PostService'
import { IPost } from './post/entities/IPost'
import { IReaction } from './reaction/entities/IReaction'
import { ReactionController } from './reaction/services/ReactionService'

export const mockContext = (): Context => ({
  postController: new PostController(new MockListableRepository<IPost>()),
  reactionController: new ReactionController(new MockRepository<IReaction>())
})
