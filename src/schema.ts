import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'

export const typeDefs: any = await loadSchema('./**/*.graphql', {
  loaders: [new GraphQLFileLoader()]
})
