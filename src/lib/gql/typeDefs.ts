import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'
import { loadSchema } from '@graphql-tools/load'

export const typeDefs = await loadSchema('./**/*.graphql', {
  loaders: [new GraphQLFileLoader()]
})
