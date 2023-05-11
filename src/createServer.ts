import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import { resolvers, typeDefs } from './schema'
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
