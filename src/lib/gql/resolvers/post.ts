import { Post, PostController } from '@/entities/Post'
import { Context } from '../context'
import { PostRepository } from '@/repositories/PostRepository'
import { getOrm } from '@/lib/orm/orm'
// TODO Remove
import config from '@/mikro-orm-test.config'
import { toGlobalId } from 'graphql-relay'

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
      const _postController = new PostController(new PostRepository(orm.em.fork()))
      contextValue = {
        postController: _postController
      } as unknown as Context

      const { postController } = contextValue as unknown as {
        postController: PostController
      }

      return postController.listPosts(args.offset, args.limit)
    }
  },
  Post: {
    id: (parent: Post) => {
      return toGlobalId('Post', parent.id)
    }
  }
}
