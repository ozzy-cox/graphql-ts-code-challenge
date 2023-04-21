import { ApolloServer } from '@apollo/server'
import { resolvers } from './resolvers/post'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './typeDefs'

export const initServer = async () => {
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
