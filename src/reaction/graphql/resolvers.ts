import { Resolvers } from '@/generated/graphql'

export const resolvers: Resolvers = {
  Mutation: {
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
