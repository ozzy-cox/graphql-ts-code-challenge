import { toGlobalId } from 'graphql-relay'
import { ReactionType } from '@/reaction/entities/IReaction'
import { fromGlobalId } from 'graphql-relay'
import { Resolvers } from '@/generated/graphql'

export const resolvers: Resolvers = {
  Query: {
    posts: async (_, args, context) => {
      if (args.limit) {
        if (args.cursor) {
          const { id } = fromGlobalId(args.cursor)
          return await context.postService.listPosts(args.limit, id)
        } else {
          return await context.postService.listPosts(args.limit)
        }
      }
      return []
    }
  },
  Post: {
    id: (parent) => {
      return toGlobalId('Post', parent.id)
    },
    comments: async (parent, args, context) => {
      if (args?.flat) {
        return await context.postService.getAllComments(parent)
      } else {
        return await context.postService.getComments(parent)
      }
    },
    comment_count: async (parent, __, context) => {
      return await context.postService.getCommentCounts(parent)
    },
    reaction_counts: async (parent, __, context) => {
      // TODO move functionality to service or repo
      return await Promise.all(
        Object.values(ReactionType).map(async (type) => {
          return {
            type: type,
            count: await context.reactionService.getReactionCounts(parent, type)
          }
        })
      )
    }
  },
  Mutation: {
    post: async (_, args, context) => {
      let post
      if (args.postId) post = await context.postService.getPostById(args.postId)
      return (await context.postService.createPost(args.content, post)) || null
    },
    react: async (_, args, context) => {
      const post = await context.postService.getPostById(args.postId)
      const reaction = await context.reactionService.createReaction(args.type, post)
      if (reaction) {
        return reaction
      }
      return null
    }
  }
}
