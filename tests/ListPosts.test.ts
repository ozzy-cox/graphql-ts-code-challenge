import { Context, context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers'
import { typeDefs } from '@/lib/gql/typeDefs'
import { Post } from '@/lib/orm/models/Post'
import { getOrm } from '@/lib/orm/orm'
import { ApolloServer } from '@apollo/server'
import config from '@/mikro-orm-test.config'
import { wipeDb } from '../src/initDBStateForTest'
import assert from 'node:assert'
import { PostController } from '@/entities/Post'
import { PostRepository } from '@/repositories/PostRepository'
import { MikroORM, IDatabaseDriver, Connection } from '@mikro-orm/core'
import { Resolved } from '@/types'
import { ReactionController, ReactionType } from '@/entities/Reaction'
import { ReactionRepository } from '@/repositories/ReactionRepository'
import { toGlobalId } from 'graphql-relay'

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
    const postController = new PostController(new PostRepository(orm.em.fork()))
    const reactionController = new ReactionController(new ReactionRepository(orm.em.fork()))

    const post1 = await postController.createPost('Have a nice day!')
    const reaction1 = post1 && (await reactionController.createReaction(ReactionType.THUMBSDOWN, post1))
    const reaction2 = post1 && (await reactionController.createReaction(ReactionType.ROCKET, post1))
    {
      await postController.createPost('You too !', post1)
    }
    const post2 = await postController.createPost('Lorem ipsum')
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
    const responseData = response.body.singleResult.data?.posts as Resolved<Post>[]
    expect(responseData.map((post) => post.comment_count)).toEqual([1, 0, 2])

    expect((responseData[0] as any).reaction_counts).toEqual([
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
