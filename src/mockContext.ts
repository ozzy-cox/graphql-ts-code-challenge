import { Context } from './context'
import { PostService } from './post/services/PostService'
import { ReactionService } from './reaction/services/ReactionService'
import { MockPostRepository } from './post/infra/mock/MockPostRepository'
import { MockReactionRepository } from './reaction/infra/mock/MockReactionRepository'

export const mockContext = async (): Promise<Context> => {
  const postService = new PostService(new MockPostRepository())
  const reactionService = new ReactionService(new MockReactionRepository())

  const serviceMap = {
    Post: postService
  }

  return {
    postService,
    reactionService,
    serviceMap
  }
}
