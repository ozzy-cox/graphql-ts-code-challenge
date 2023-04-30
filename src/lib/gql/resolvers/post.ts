import { Post } from '@/entities/Post'
import { Context } from '../context'
import { toGlobalId } from 'graphql-relay'
import { IResolvers } from '@graphql-tools/utils'
import { ReactionType } from '@/entities/Reaction'

export const resolvers: IResolvers<unknown, Context> = {
  Query: {
    posts: async (
      _,
      args: {
        offset?: number
        limit?: number
      },
      contextValue: Context
    ) => {
      return contextValue.postController.listPosts(args.offset, args.limit)
    }
  },
  Post: {
    id: (parent: Post) => {
      return toGlobalId('Post', parent.id)
    },
    comments: async (parent: Post, args, context) => {
      if (args?.flat) {
        const getAllComments = async (post: Post) => {
          const accumulator: Post[] = []
          const comments = await context.postController.getComments(post)
          if (comments.length > 0) {
            accumulator.push(...comments)
            await Promise.all(
              comments.map(async (comment) => {
                accumulator.push(...(await getAllComments(comment)))
              })
            )
          }
          return accumulator
        }
        return getAllComments(parent)
      } else {
        return await context.postController.getComments(parent)
      }
    },
    comment_count: async (parent: Post, __, context) => {
      return await context.postController.getCommentCounts(parent)
    },
    reaction_counts: async (parent: Post, __, context) => {
      return await Promise.all(
        Object.values(ReactionType).map(async (type) => {
          return {
            type: type,
            count: context.reactionController.getReactionCounts(parent, type)
          }
        })
      )
    }
  }
}
