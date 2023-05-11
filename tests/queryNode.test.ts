import { Context } from '@/context'
import { Post } from '@/generated/graphql'
import { mockContext } from '@/mockContext'
import { IPost } from '@/post/entities/IPost'
import { resolvers } from '@/post/infra/graphql/resolvers'
import { typeDefs } from '@/schema'
import { ApolloServer } from '@apollo/server'
import assert from 'assert'
import { fromGlobalId, toGlobalId } from 'graphql-relay'

describe('querying the server for a node', () => {
  let testServer: ApolloServer<Context>
  let context: Context
  let post: IPost | undefined

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    context = await mockContext()
    post = await context.postService.createPost('Test post content')
  })

  test('should query for a node that is a post', async () => {
    const query = `#graphql
        query getNode($id: ID!) {
            node(id: $id) {
                __typename,
                id,
                ... on Post {
                    content,
                    createdAt
                }
            }
        }
    `
    assert(post)
    const response = await testServer.executeOperation(
      {
        query,
        variables: {
          id: toGlobalId('Post', post.id)
        }
      },
      {
        contextValue: context
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    const { content, id, createdAt } = response.body.singleResult.data?.node as Post

    expect(content).toEqual(post.content)
    expect(fromGlobalId(id).id).toEqual(post.id)
    expect(createdAt).toEqual(post.createdAt)
  })
})
