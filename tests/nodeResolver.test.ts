import { Context } from '@/context'
import { mockContext } from '@/mockContext'
import { IPost } from '@/post/entities/IPost'
import { resolvers } from '@/post/infra/graphql/resolvers'
import assert from 'assert'
import { toGlobalId } from 'graphql-relay'

describe('using global id to query a post', () => {
  let context: Context
  let post: IPost | undefined
  beforeAll(async () => {
    context = await mockContext()
    post = await context.postService.createPost('Post content 1')
  })

  test('should request a post using the node resolver', async () => {
    assert(post)
    const args = { id: toGlobalId('Post', post.id) }
    const nodeResponse = resolvers.Query?.node instanceof Function && (await resolvers.Query?.node({}, args, context))

    assert(nodeResponse)
    expect(nodeResponse).toEqual(post)
  })
})
