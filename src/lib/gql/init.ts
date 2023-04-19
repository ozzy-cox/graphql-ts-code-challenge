import { ApolloServer } from '@apollo/server'
import { resolvers } from './resolvers/post'
import { startStandaloneServer } from '@apollo/server/standalone'
import { loadSchema } from '@graphql-tools/load'
import { GraphQLFileLoader } from '@graphql-tools/graphql-file-loader'

export const initServer = async () => {
  const typeDefs = await loadSchema('./**/*.graphql', {
    loaders: [new GraphQLFileLoader()]
  })

  const server = await startStandaloneServer(
    new ApolloServer({
      typeDefs,
      resolvers
    }),
    {
      listen: { port: 4000 }
    }
  )

  const { url } = server

  console.log(`🚀  Server ready at: ${url}`)
  return server
}
