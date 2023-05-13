import { ApolloServer } from '@apollo/server'
import { wipeDb } from '../../src/shared/infra/orm/initDBStateForTest'
import assert from 'node:assert'
import { Post as ResolvedPost } from '@/generated/graphql'
import { toGlobalId } from 'graphql-relay'
import { Context, context } from '@/context'
import { typeDefs } from '@/schema'
import { resolvers } from '@/schema'
import { ReactionType } from '@/reaction/entities/IReaction'
import { ORM } from '@/orm'

describe('querying server', () => {
  let testServer: ApolloServer<Context>
  let _context: Context

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    await wipeDb()
    _context = await context()
  })

  test('list first three posts', async () => {
    const { postService, reactionService } = _context

    const post1 = await postService.createPost('Have a nice day!')
    {
      await postService.createPost('You too !', post1)
    }
    const post2 = await postService.createPost('Lorem ipsum')
    post2 && (await reactionService.createReaction(ReactionType.THUMBSDOWN, post2))
    post2 && (await reactionService.createReaction(ReactionType.ROCKET, post2))
    const post3 = await postService.createPost('Coding is fun!')
    {
      await postService.createPost('random comment 1', post3)
      await postService.createPost('asdfasf', post3)
    }
    await postService.createPost('I cant find original content')

    const first = 3
    const after = post1 && toGlobalId('Post', post1.id)

    const query = `#graphql
        query Posts($first: Int, $after: ID!, $commentsFirst: Int) {
            posts(first: $first, after: $after) {
                __typename,
                id,
                content,
                createdAt,
                commentsConnection(first: $commentsFirst){
                  commentCount
                }
                reactionCounts{
                  type,
                  count
                }
            }
        }
    `

    const response = await testServer.executeOperation(
      {
        query,
        variables: {
          first,
          after,
          commentsFirst: 3
        }
      },
      {
        contextValue: _context
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    const responseData = response.body.singleResult.data?.posts as ResolvedPost[]
    expect(responseData.map((post) => post.commentsConnection?.commentCount)).toEqual([0, 2, 0])
    // TODO compare comments response with comment objects

    expect(responseData[0].reactionCounts).toEqual([
      {
        type: ReactionType.THUMBSUP,
        count: 0
      },
      {
        type: ReactionType.THUMBSDOWN,
        count: 1
      },
      {
        type: ReactionType.ROCKET,
        count: 1
      },
      {
        type: ReactionType.HEART,
        count: 0
      }
    ])
  })

  afterAll(async () => {
    await wipeDb()
    await (await ORM.getInstance()).close()
  })
})
