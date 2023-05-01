import { Post } from '@/entities/Post'
import { resolvers } from '@/lib/gql/resolvers'
import { mockContext } from '@/repositories/mock/mockContext'
import { every, range } from 'lodash-es'

describe('listing posts using the resolver', () => {
  const posts: Post[] = []
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
    const offset = 2
    const args = {
      offset,
      limit
    }

    const postsResponse = await resolvers.Query.posts(undefined, args, context)

    expect(postsResponse.length).toEqual(limit)
    expect(
      every(postsResponse, (post) => {
        return (
          posts.find(({ id }: { id: number }) => {
            return id === post.id
          })?.content === post?.content
        )
      })
    ).toBeTruthy()
  })
})
