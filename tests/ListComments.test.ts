import { ApolloServer } from '@apollo/server'
import { EntityRepository } from '@mikro-orm/core'
import assert from 'assert'
import { toGlobalId } from 'graphql-relay'
import { getOrm } from '@/createOrm'
import config from '@/shared/infra/orm/mikro-orm-test.config'
import { PostRepository } from '@/post/infra/orm/repositories/PostRepository'
import { Context } from '@/context'
import { Post } from '@/post/infra/orm/models/Post'
import { typeDefs } from '@/schema'
import { resolvers } from '@/post/infra/graphql/resolvers'
import { wipeDb } from '@/shared/infra/orm/initDBStateForTest'
import { Post as ResolvedPost } from '@/generated/graphql'
import { mockContext } from '@/mockContext'

const orm = await getOrm(config)
const em = orm.em.fork()
// TODO add test with orm repo

describe('listing comments', () => {
  let testServer: ApolloServer<Context>
  let orm
  let postRepository: EntityRepository<Post>
  // TODO add test with orm repo
  const { postController, reactionController } = mockContext()
  beforeAll(async () => {
    testServer = new ApolloServer<Context>({
      typeDefs,
      resolvers
    })

    orm = await getOrm(config)
    await wipeDb()

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

    const cursor = post && toGlobalId('Post', post.id)

    const query = `#graphql
        query Posts($cursor: ID!, $limit: Int) {
            posts(cursor: $cursor, limit: $limit) {
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
          cursor,
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
    // @ts-ignore
    assert(response.body.singleResult.data?.posts !== undefined)
    expect((response.body.singleResult.data?.posts as Post[]).length).toEqual(1)
    const postResponse = (response.body.singleResult.data?.posts as ResolvedPost[])[0]

    const comments = postResponse.comments as unknown as ResolvedPost[]
    expect(comments.map((post) => post.id).every((id) => commentIds.includes(id))).toBeTruthy()
  })
})
