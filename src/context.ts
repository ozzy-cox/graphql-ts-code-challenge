import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { PostService } from '@/post/services/PostService'
import { ReactionRepository } from '@/reaction/infra/orm/repositories/ReactionRepository'
import { ORM } from './orm'
import { ReactionService } from './reaction/services/ReactionService'
import { INodeService } from './shared/services/INodeService'
import { IPost } from './post/entities/IPost'

export type Context = {
  postService: PostService
  reactionService: ReactionService
  serviceMap: Record<string, INodeService<IPost>>
}

export const context = async (): Promise<Context> => {
  const orm = await ORM.getInstance()
  const em = orm.em.fork()
  const postService = new PostService(new PostRepository(em))
  const reactionService = new ReactionService(new ReactionRepository(em))
  const serviceMap = {
    Post: postService
  }
  return {
    postService,
    reactionService,
    serviceMap
  }
}
