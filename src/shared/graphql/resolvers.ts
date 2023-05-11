import { Resolvers } from '@/generated/graphql'
import { fromGlobalId } from 'graphql-relay'

export const resolvers: Resolvers = {
  Query: {
    node: async (_, args, context) => {
      const { type, id } = fromGlobalId(args.id)
      if (type in context.serviceMap) {
        return await context.serviceMap[type].findById(id)
      }
      return null
    }
  },
  Node: {
    __resolveType: (parent) => {
      return parent.content ? 'Post' : null
    }
  }
}
