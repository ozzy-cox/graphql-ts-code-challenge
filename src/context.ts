import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { PostService } from '@/post/services/PostService'
import { ReactionRepository } from '@/reaction/infra/orm/repositories/ReactionRepository'
import { ORM } from './orm'
import { ReactionService } from './reaction/services/ReactionService'

export type Context = {
  postService: PostService
  reactionService: ReactionService
}

export const context = async (): Promise<Context> => {
  const orm = await ORM.getInstance()
  const em = orm.em.fork()
  const postService = new PostService(new PostRepository(em))
  const reactionService = new ReactionService(new ReactionRepository(em))
  return {
    postService,
    reactionService
  }
}
