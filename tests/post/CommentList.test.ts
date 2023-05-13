import { ApolloServer } from '@apollo/server'
import assert from 'assert'
import { toGlobalId } from 'graphql-relay'
import { Context } from '@/context'
import { Post } from '@/post/infra/orm/models/Post'
import { typeDefs } from '@/schema'
import { resolvers } from '@/schema'
import { Post as ResolvedPost } from '@/generated/graphql'
import { mockContext } from '@/mockContext'

describe('listing comments', () => {
  let testServer: ApolloServer<Context>
  let context: Context

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    context = await mockContext()
  })

  test('listing comments on a post', async () => {
    const { postService } = context
    const post = await postService.createPost('We deployed the latest feature to prod!')
    const comment1 = await postService.createPost('Hold my beer!', post)
    const comment2 = await postService.createPost('Mine too!', comment1)
    const comment3 = await postService.createPost('+1', comment1)
    const comment4 = await postService.createPost('Or maybe my Raki? :)', comment1)

    const comment5 = await postService.createPost('We have to celebrate this one!', post)
    const comment6 = await postService.createPost('Where is the party?', comment5)
    const comment7 = await postService.createPost('At the office of course!!', comment6)

    const commentIds = [comment1, comment2, comment3, comment4, comment5, comment6, comment7].map((comment) =>
      toGlobalId('Post', comment?.id || '')
    )

    const after = post && toGlobalId('Post', post.id)

    const query = `#graphql
        query Posts($after: ID!, $first: Int) {
            posts(after: $after, first: $first) {
                id,
                content,
                createdAt,
                commentsConnection(flat: true){
                    commentCount
                    edges{
                      node{
                        id
                      }
                    }
                    pageInfo{
                      hasNextPage
                    }
                }
            }
        }
    `

    const response = await testServer.executeOperation(
      {
        query,
        variables: {
          after,
          first: 1
        }
      },
      {
        contextValue: context
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    assert(response.body.singleResult.data?.posts !== undefined)
    expect((response.body.singleResult.data?.posts as Post[]).length).toEqual(1)
    const postResponse = (response.body.singleResult.data?.posts as ResolvedPost[])[0]

    const comments = postResponse.commentsConnection?.edges?.map((edge) => edge?.node) as unknown as ResolvedPost[]
    expect(comments.map((post) => post.id).every((id) => commentIds.includes(id))).toBeTruthy()
  })
})
