import { toGlobalId } from 'graphql-relay'
import { ReactionType } from '@/reaction/entities/IReaction'
import { fromGlobalId } from 'graphql-relay'
import { Resolvers } from '@/generated/graphql'

export const resolvers: Resolvers = {
  Query: {
    node: async (_, args, context) => {
      const { type, id } = fromGlobalId(args.id)
      if (type in context.serviceMap) {
        return await context.serviceMap[type].findById(id)
      }
      return null
    },
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
  Node: {
    __resolveType: (parent) => {
      return parent.content ? 'Post' : null
    }
  },
  Mutation: {
    post: async (_, args, context) => {
      let post
      if (args.postId) {
        post = await context.postService.getPostById(args.postId)
        if (post) return (await context.postService.createPost(args.content, post)) || null
      }
      return (await context.postService.createPost(args.content)) || null
    },
    react: async (_, args, context) => {
      const post = await context.postService.getPostById(args.postId)
      if (post) {
        await context.reactionService.createReaction(args.type, post)
        return post
      }
      return null
    }
  }
}
