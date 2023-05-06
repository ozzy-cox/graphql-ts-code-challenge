import assert from 'assert'
import { _IPostRepository } from '../repositories/IPostRepository'

export const postRepoTest = (repoHook: () => () => _IPostRepository) => {
  const getRepo = repoHook()
  describe('using post repository', () => {
    test('should use repository to create a post', async () => {
      const postRepository = getRepo()
      const postContent = 'post content'
      const post = await postRepository.create({
        content: postContent
      })

      assert(post !== undefined)

      expect(post).toHaveProperty('id')
      expect(post.content).toBe(postContent)
    })
  })
}
