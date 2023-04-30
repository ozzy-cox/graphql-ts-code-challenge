import { PostController, Post as IPost } from '@/entities/Post'
import { initDBStateForTest, wipeDb } from '@/initDBStateForTest'
import { Context } from '@/lib/gql/context'
import { resolvers } from '@/lib/gql/resolvers/post'
import { typeDefs } from '@/lib/gql/typeDefs'
import { getOrm } from '@/lib/orm/orm'
import { ApolloServer } from '@apollo/server'
import { EntityRepository } from '@mikro-orm/core'
import config from '@/mikro-orm-test.config'
import { PostRepository } from '@/repositories/PostRepository'
import assert from 'assert'
import { MockListableRepository, MockRepository } from '@/repositories/mock/InMemoryRepo'
import { Post } from '@/lib/orm/models/Post'
import { toGlobalId } from 'graphql-relay'
import { Resolved } from '@/types'
import { ReactionController, ReactionType } from '@/entities/Reaction'
import { Reaction } from '@/lib/orm/models/Reaction'

const orm = await getOrm(config)
const em = orm.em.fork()
// TODO add test with orm repo
const ormPostRepository = new PostRepository(em)

describe('listing comments', () => {
  let testServer: ApolloServer<Context>
  let orm
  let postRepository: EntityRepository<Post>
  // TODO add test with orm repo
  const postController = new PostController(new MockListableRepository<Post>())
  const reactionController = new ReactionController(new MockRepository<Reaction>())

  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    orm = await getOrm(config)
    await wipeDb()
    // await initDBStateForTest(orm)

    postRepository = orm.em.fork().getRepository(Post)
  })

  test('listing comments on a post', async () => {
    const post = await postController.createPost('We deployed the latest feature to prod!')
    const comment1 = await postController.createPost('Hold my beer!', post)
    const comment2 = await postController.createPost('Mine too!', comment1)
    const comment3 = await postController.createPost('+1', comment1)
    const comment4 = await postController.createPost('Or maybe my Raki? :)', comment1)

    const comment5 = await postController.createPost('We have to celebrate this one!', post)
    const comment6 = await postController.createPost('Where is the party?', comment5)
    const comment7 = await postController.createPost('At the office of course!!', comment6)

    const commentIds = [comment1, comment2, comment3, comment4, comment5, comment6, comment7].map((comment) =>
      toGlobalId('Post', comment?.id || '')
    )

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

    const response = await testServer.executeOperation(
      {
        query,
        variables: {
          offset: 0,
          limit: 1
        }
      },
      {
        contextValue: {
          postController,
          reactionController
        }
      }
    )

    assert(response.body.kind === 'single')
    expect(response.body.singleResult.errors).toBeUndefined()
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    //@ts-ignore
    assert(response.body.singleResult.data?.posts !== undefined)
    expect((response.body.singleResult.data?.posts as Post[]).length).toEqual(1)
    const postResponse = (response.body.singleResult.data?.posts as Resolved<IPost>[])[0]

    const comments = postResponse.comments as unknown as Resolved<IPost>[]
    expect(comments.map((post) => post.id).every((id) => commentIds.includes(id))).toBeTruthy()
  })
})
