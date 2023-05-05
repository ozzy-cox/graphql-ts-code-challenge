import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { PostController } from '@/post/services/PostService'
import { ReactionRepository } from '@/reaction/infra/orm/repositories/ReactionRepository'
import { getOrm } from './createOrm'
import { ReactionController } from './reaction/services/ReactionService'

export type Context = {
  postController: PostController
  reactionController: ReactionController
}

export const context = async () => {
  const orm = await getOrm(config)
  const em = orm.em.fork()
  const postController = new PostController(new PostRepository(em))
  const reactionController = new ReactionController(new ReactionRepository(em))
  return {
    orm,
    postController,
    reactionController
  }
}
