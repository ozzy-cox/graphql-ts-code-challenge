import { IPostRepository, PostController } from '@/entities/Post'
import { initDBStateForTest, wipeDb } from '@/initDBStateForTest'
import { Context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers/post'
import { typeDefs } from '@/lib/gql/typeDefs'
import { Post } from '@/lib/orm/models/Post'
import { getOrm } from '@/lib/orm/orm'
import { ApolloServer } from '@apollo/server'
import { EntityRepository } from '@mikro-orm/core'
import config from '@/mikro-orm-test.config'
import { PostRepository } from '@/repositories/PostRepository'
import assert from 'assert'

const orm = await getOrm(config)
const em = orm.em.fork()
const ormPostRepository = new PostRepository(em)

describe('listing comments', () => {
  let testServer: ApolloServer<Context>
  let orm
  let postRepository: EntityRepository<Post>

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    orm = await getOrm(config)
    await wipeDb()
    await initDBStateForTest(orm)

    postRepository = orm.em.fork().getRepository(Post)
  })

  const postController = new PostController(ormPostRepository)
  test('listing comments on a post', async () => {
    const post = await postController.createPost('We deployed the latest feature to prod!')
    const comment1 = await postController.createPost('Hold my beer!', post)
    const comment2 = await postController.createPost('Mine too!', comment1)
    const comment3 = await postController.createPost('+1', comment1)
    const comment4 = await postController.createPost('Or maybe my Raki? :)', comment1)

    const comment5 = await postController.createPost('We have to celebrate this one!', post)
    const comment6 = await postController.createPost('Where is the party?', comment5)
    const comment7 = await postController.createPost('At the office of course!!', comment6)

    const postIds = [comment1?.id, comment2?.id, comment3?.id, comment4?.id, comment5?.id, comment6?.id, comment7?.id]

    const query = `#graphql
        query Posts($offset: Int, $limit: Int) {
            posts(offset: $offset, limit: $limit) {
                id,
                content,
                createdAt,
                comments(flat: true){
                    id
                }
            }
        }
    `
    const response = await testServer.executeOperation({
      query,
      variables: {
        offset: 0,
        limit: 1
      }
    })

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    expect((response.body.singleResult.data?.posts?.comments as Post[]).map((post) => post.id)).toEqual(postIds)
  })
})
