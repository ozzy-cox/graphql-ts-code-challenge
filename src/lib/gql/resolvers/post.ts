import { Context } from '../context'

export const resolvers = {
  Query: {
    posts: async (
      parent: unknown,
      args: {
        after?: number
        first?: number
      },
      contextValue: Context,
      info: unknown
    ) => {
      // console.log(parent)
      // console.log(args)
      // console.log(contextValue)
      // console.log(info)
    }
  },
  Post: {}
}
