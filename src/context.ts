import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { PostService } from '@/post/services/PostService'
import { ReactionRepository } from '@/reaction/infra/orm/repositories/ReactionRepository'
import { getOrm } from './createOrm'
import { ReactionService } from './reaction/services/ReactionService'

export type Context = {
  postService: PostService
  reactionService: ReactionService
}

export const context = async () => {
  const orm = await getOrm(config)
  const em = orm.em.fork()
  const postService = new PostService(new PostRepository(em))
  const reactionService = new ReactionService(new ReactionRepository(em))
  return {
    orm,
    postService,
    reactionService
  }
}
