import { PostRepository } from '@/repositories/PostRepository'
import { getOrm } from '@/lib/orm/orm'
import config from '@/mikro-orm-test.config'
import { PostController } from '@/entities/Post'

export type Context = {
  postController: PostController
}

export const context = async () => {
  const orm = await getOrm(config)
  const postController = new PostController(new PostRepository(orm.em.fork()))
  return {
    orm,
    postController
  }
}
