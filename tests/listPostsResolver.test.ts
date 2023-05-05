import { every, range } from 'lodash-es'
import { toGlobalId } from 'graphql-relay'
import { IPost } from '@/post/entities/IPost'
import { mockContext } from '@/mockContext'
import { resolvers } from '@/post/infra/graphql/resolvers'

describe('listing posts using the resolver', () => {
  const posts: IPost[] = []
  const context = mockContext()
  beforeAll(async () => {
    await Promise.all(
      range(10).map(async (idx: number) => {
        const post = await context.postController.createPost(`Post content ${idx}`)
        if (post) posts.push(post)
      })
    )
  })

  test('should list posts', async () => {
    const limit = 4
    const cursor = toGlobalId('Post', posts[2].id)
    const args = {
      cursor,
      limit
    }

    const postsResponse = (await resolvers.Query.posts(undefined, args, context)) as IPost[]

    expect(postsResponse.length).toEqual(limit)
    expect(
      every(postsResponse, (post) => {
        return (
          posts.find(({ id }: { id: number }) => {
            return id === post?.id
          })?.content === post?.content
        )
      })
    ).toBeTruthy()
  })
})
