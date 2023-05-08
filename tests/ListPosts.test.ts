import { ApolloServer } from '@apollo/server'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { wipeDb } from '../src/shared/infra/orm/initDBStateForTest'
import assert from 'node:assert'
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { Post as ResolvedPost } from '@/generated/graphql'
import { toGlobalId } from 'graphql-relay'
import { Context, context } from '@/context'
import { typeDefs } from '@/schema'
import { resolvers } from '@/post/infra/graphql/resolvers'
import { getOrm } from '@/createOrm'
import { PostService } from '@/post/services/PostService'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { ReactionType } from '@/reaction/entities/IReaction'
import { ReactionRepository } from '@/reaction/infra/orm/repositories/ReactionRepository'
import { Post } from '@/post/infra/orm/models/Post'
import { ReactionService } from '@/reaction/services/ReactionService'

describe('querying server', () => {
  let testServer: ApolloServer<Context>
  let orm: MikroORM<IDatabaseDriver<Connection>>

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    orm = await getOrm(config)
    await wipeDb()
  })

  test('list first three posts', async () => {
    const postController = new PostService(new PostRepository(orm.em.fork()))
    const reactionController = new ReactionService(new ReactionRepository(orm.em.fork()))

    const post1 = await postController.createPost('Have a nice day!')
    {
      await postController.createPost('You too !', post1)
    }
    const post2 = await postController.createPost('Lorem ipsum')
    const reaction1 = post2 && (await reactionController.createReaction(ReactionType.THUMBSDOWN, post2))
    const reaction2 = post2 && (await reactionController.createReaction(ReactionType.ROCKET, post2))
    const post3 = await postController.createPost('Coding is fun!')
    {
      await postController.createPost('random comment 1', post3)
      await postController.createPost('asdfasf', post3)
    }
    await postController.createPost('I cant find original content')

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
