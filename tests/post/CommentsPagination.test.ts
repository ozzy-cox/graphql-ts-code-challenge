import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { IPost } from '@/post/entities/IPost'
import { resolvers, typeDefs } from '@/schema'
import { ApolloServer } from '@apollo/server'
import { toGlobalId } from 'graphql-relay'
import { range } from 'lodash-es'

describe('paginating comments of a post', () => {
  let testServer: ApolloServer<Context>
  let context: Context
  let post: IPost | undefined
  let comments: IPost[]

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    context = await mockContext()
    post = await context.postService.createPost('Post content')
    comments = (
      await Promise.all(range(150).map((idx) => context.postService.createPost(`Comment content ${idx}`, post)))
    ).filter((post): post is IPost => !!post)
  })

  test('should list paginated comments', async () => {
    const cursor = toGlobalId('Post', comments[7].id)

    const query = `#graphql
        query getPost($id: ID!, $first: Int, $after: PostCursor){
            node(id: $id){
                ... on Post{
                    comments(first: $first, after: $after){
                        id
                        createdAt
                        content
                    }

                }
            }

        }

    `

    const response = await testServer.executeOperation(
      {
        query,
        variables: {
          first: 5,
          after: cursor
        }
      },
      {
        contextValue: context
      }
    )
  })
})
