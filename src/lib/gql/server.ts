import { ApolloServer } from '@apollo/server'
import { resolvers } from './resolvers/post'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './typeDefs'

export const initServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })
  const serverHandle = await startStandaloneServer(server, {
    listen: { port: 4000 }
  })

  const { url } = serverHandle

  console.log(`🚀  Server ready at: ${url}`)
  return server
}
