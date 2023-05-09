import { ApolloServer } from '@apollo/server'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { wipeDb } from '../src/shared/infra/orm/initDBStateForTest'
import assert from 'node:assert'
import { Post as ResolvedPost } from '@/generated/graphql'
import { toGlobalId } from 'graphql-relay'
import { Context, context } from '@/context'
import { typeDefs } from '@/schema'
import { resolvers } from '@/post/infra/graphql/resolvers'
import { getOrm } from '@/createOrm'
import { ReactionType } from '@/reaction/entities/IReaction'

describe('querying server', () => {
  let testServer: ApolloServer<Context>

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    await wipeDb()
  })

  test('list first three posts', async () => {
    const { postService, reactionService } = await context()

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

    const limit = 3
    const cursor = post1 && toGlobalId('Post', post1.id)

    const query = `#graphql
        query Posts($cursor: ID!, $limit: Int) {
            posts(cursor: $cursor, limit: $limit) {
                id,
                content,
                createdAt,
                comment_count,
                reaction_counts{
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
          cursor,
          limit
        }
      },
      {
        contextValue: await context()
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    const responseData = response.body.singleResult.data?.posts as ResolvedPost[]
    expect(responseData.map((post) => post.comment_count)).toEqual([0, 2, 0])

    expect(responseData[0].reaction_counts).toEqual([
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
    await (await getOrm(config)).close()
    await testServer.stop()
  })
})
