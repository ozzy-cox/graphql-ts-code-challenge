import { PostRepository } from '@/repositories/PostRepository'
import { getOrm } from '@/lib/orm/orm'
import config from '@/mikro-orm-test.config'
import { PostController } from '@/entities/Post'
import { ReactionController } from '@/entities/Reaction'
import { ReactionRepository } from '@/repositories/ReactionRepository'

export type Context = {
  postController: PostController
  reactionController: ReactionController
}

export const context = async () => {
  const orm = await getOrm(config)
  const postController = new PostController(new PostRepository(orm.em.fork()))
  const reactionController = new ReactionController(new ReactionRepository(orm.em.fork()))
  return {
    orm,
    postController,
    reactionController
  }
}
