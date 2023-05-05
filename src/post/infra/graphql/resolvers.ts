import { IPost } from '@/post/entities/IPost'
import { Context } from '../../../context'
import { toGlobalId } from 'graphql-relay'
import { ReactionType } from '@/reaction/entities/IReaction'
import { fromGlobalId } from 'graphql-relay'

export const resolvers = {
  Query: {
    posts: async (
      _: unknown,
      args: {
        cursor: string
        limit?: number
      },
      context: Context
    ) => {
      const { id } = fromGlobalId(args.cursor)
      const postId = parseInt(id)
      return context.postController.listPosts(postId, args.limit)
    }
  },
  Post: {
    id: (parent: IPost) => {
      return toGlobalId('Post', parent.id)
    },
    comments: async (
      parent: IPost,
      args: {
        flat?: boolean
      },
      context: Context
    ) => {
      if (args?.flat) {
        const getAllComments = async (post: IPost) => {
          const accumulator: (IPost | Error)[] = []
          const comments = await context.postController.getComments(post)
          if (comments.length > 0) {
            accumulator.push(...comments)
            await Promise.all(
              comments.map(async (comment) => {
                if (!(comment instanceof Error)) accumulator.push(...(await getAllComments(comment)))
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
    comment_count: async (parent: IPost, __: unknown, context: Context) => {
      return await context.postController.getCommentCounts(parent)
    },
    reaction_counts: async (parent: IPost, __: unknown, context: Context) => {
      return await Promise.all(
        Object.values(ReactionType).map(async (type) => {
          return {
            type: type,
            count: context.reactionController.getReactionCounts(parent, type)
          }
        })
      )
    }
  },
  Mutation: {
    post: async (
      _: unknown,
      args: {
        content: string
        postId?: number
      },
      context: Context
    ) => {
      let post
      if (args.postId) post = await context.postController.getPostById(args.postId)
      return await context.postController.createPost(args.content, post)
    },
    react: async (
      _: unknown,
      args: {
        type: ReactionType
        postId: number
      },
      context: Context
    ) => {
      const post = await context.postController.getPostById(args.postId)
      return await context.reactionController.createReaction(args.type, post)
    }
  }
}
