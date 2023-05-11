import { every, range } from 'lodash-es'
import { toGlobalId } from 'graphql-relay'
import { IPost } from '@/post/entities/IPost'
import { mockContext } from '@/mockContext'
import { resolvers } from '@/schema'
import { QueryPostsArgs } from '@/generated/graphql'
import assert from 'assert'
import { Context } from '@/context'

describe('listing posts using the resolver', () => {
  const posts: IPost[] = []
  let context: Context

  beforeAll(async () => {
    context = await mockContext()
    await Promise.all(
      range(10).map(async (idx: number) => {
        const post = await context.postService.createPost(`Post content ${idx}`)
        if (post) posts.push(post)
      })
    )
  })

  test('should list posts', async () => {
    const limit = 4
    const cursor = toGlobalId('Post', posts[2].id)
    const args: Partial<QueryPostsArgs> = {
      cursor,
      limit
    }

    const postsResponse =
      resolvers.Query?.posts instanceof Function && (await resolvers.Query?.posts({}, args, context))

    assert(postsResponse)
    expect(postsResponse.length).toEqual(limit)
    expect(
      every(postsResponse, (post) => {
        return (
          posts.find(({ id }) => {
            return id === post?.id
          })?.content === post?.content
        )
      })
    ).toBeTruthy()
  })
})
