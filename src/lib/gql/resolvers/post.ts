import { PostController } from '@/entities/Post'
import { Context } from '../context'
import { ORMPostRepository } from '@/repositories/EntityRepository'
import { getOrm } from '@/lib/orm/orm'
// TODO Remove
import config from '@/mikro-orm-test.config'

export const resolvers = {
  Query: {
    posts: async (
      parent: unknown,
      args: {
        offset?: number
        limit?: number
      },
      contextValue: Context,
      info: unknown
    ) => {
      // TODO Move these to context
      const orm = await getOrm(config)
      const _postController = new PostController(new ORMPostRepository(orm.em.fork()))
      contextValue = {
        postController: _postController
      } as unknown as Context

      const { postController } = contextValue as unknown as {
        postController: PostController
      }

      return postController.listPosts(args.offset, args.limit)
    }
  },
  Post: {}
}
