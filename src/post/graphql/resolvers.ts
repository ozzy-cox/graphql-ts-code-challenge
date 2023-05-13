import { toGlobalId } from 'graphql-relay'
import { ReactionType } from '@/reaction/entities/IReaction'
import { fromGlobalId } from 'graphql-relay'
import { Resolvers } from '@/generated/graphql'
import { IPost } from '../entities/IPost'

export const resolvers: Resolvers = {
  Query: {
    posts: async (_, args, context) => {
      if (args.first) {
        if (args.after) {
          const { id } = fromGlobalId(args.after)
          return await context.postService.listPosts(args.first, id)
        } else {
          return await context.postService.listPosts(args.first)
        }
      }
      return []
    }
  },
  Post: {
    id: (parent) => {
      return toGlobalId('Post', parent.id)
    },
    commentsConnection: async (parent, args, context) => {
      let posts: IPost[] = []
      let hasNextPage = false
      if (args.flat) {
        posts = await context.postService.getAllComments(parent)
        hasNextPage = false
      } else if (args.first) {
        posts = await context.postService.getPosts({
          parentId: parent.id,
          after: args.after || undefined,
          first: args.first ? args.first + 1 : undefined
        })
        hasNextPage = posts.length > args.first
      }
      const commentCount = await context.postService.getCommentCount(parent.id)

      const edges = posts.map((post) => ({ node: post, cursor: toGlobalId('Post', post.id) }))
      return {
        commentCount,
        edges,
        pageInfo: {
          hasNextPage,
          endCursor: edges[edges.length - 1]?.cursor || null
        }
      }
    },
    reactionCounts: async (parent, __, context) => {
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
      if (args.postId) {
        const { id } = fromGlobalId(args.postId)
        post = await context.postService.getPostById(id)
        if (post) return (await context.postService.createPost(args.content, post)) || null
      }
      return (await context.postService.createPost(args.content)) || null
    }
  }
}
