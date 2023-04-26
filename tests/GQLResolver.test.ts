import { Context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers/post'
import { typeDefs } from '@/lib/gql/typeDefs'
import { Post } from '@/lib/orm/entities'
import { getOrm } from '@/lib/orm/orm'
import { ApolloServer } from '@apollo/server'
import { EntityRepository } from '@mikro-orm/core'
import config from '@/mikro-orm-test.config'
import { initDBStateForTest, wipeDb } from '../src/initDBStateForTest'
import assert from 'node:assert'
import { toGlobalId } from 'graphql-relay'

describe('querying server', () => {
  let testServer: ApolloServer<Context>
  let orm
  let postRepository: EntityRepository<Post>

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    await wipeDb()
    await initDBStateForTest()
    orm = await getOrm(config)

    postRepository = orm.em.fork().getRepository(Post)
  })

  test('list first three posts', async () => {
    const limit = 3
    const offset = 0
    const query = `#graphql
        query Posts($offset: Int, $limit: Int) {
            posts(offset: $offset, limit: $limit) {
                id,
                content,
                createdAt
            }
        }
    `
    const response = await testServer.executeOperation({
      query,
      variables: {
        offset,
        limit
      }
    })

    const dbPosts = await postRepository.find(
      {},
      {
        offset,
        limit
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    expect((response.body.singleResult.data?.posts as Post[]).map((post) => post.id)).toEqual(
      dbPosts.map((post) => toGlobalId('Post', post.id))
    )
  })

  afterAll(async () => {
    await wipeDb()
    await (await getOrm(config)).close()
  })
})
