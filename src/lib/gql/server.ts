import { ApolloServer } from '@apollo/server'
import { resolvers } from './resolvers'
import { startStandaloneServer } from '@apollo/server/standalone'
import { typeDefs } from './typeDefs'
import { context } from './context'

export const initServer = async () => {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })
  const serverHandle = await startStandaloneServer(server, {
    listen: { port: 4000 },
    context
  })

  const { url } = serverHandle

  console.log(`🚀  Server ready at: ${url}`)
  return server
}
