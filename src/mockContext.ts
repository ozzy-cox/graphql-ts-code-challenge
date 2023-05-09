import { Context } from './context'
import { PostService } from './post/services/PostService'
import { ReactionService } from './reaction/services/ReactionService'
import { MockPostRepository } from './post/repositories/mock/MockPostRepository'
import { MockReactionRepository } from './reaction/repositories/mock/MockReactionRepository'

export const mockContext = async (): Promise<Context> => ({
  postService: new PostService(new MockPostRepository()),
  reactionService: new ReactionService(new MockReactionRepository())
})
