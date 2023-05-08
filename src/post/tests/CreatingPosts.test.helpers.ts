import { IPostRepository } from '../repositories/IPostRepository'
import { PostService } from '../services/PostService'

export const testCreatingPosts = (repoHook: () => () => IPostRepository) => {
  const getRepo = repoHook()
  describe('creating posts', () => {
    test('without content', () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)
      expect(async () => {
        await postService.createPost()
      }).rejects.toThrow('Content cannot be empty')
    })

    test('has content property', async () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)
      const content = 'Lorem ipsum'
      const post = await postService.createPost(content)
      expect(post).toHaveProperty('content')
    })

    test('has content set correctly when passed in', async () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)
      const content = 'Lorem ipsum'
      const post = await postService.createPost(content)
      expect(post && post.content).toEqual(content)
    })

    test('creating content with more than 280 characters', () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)

      const createPostWithMoreThan280Chars = async () => {
        const content =
          'Duis voluptate labore est irure occaecat elit consectetur reprehenderit excepteur tempor cupidatat nulla quis. Voluptate ex qui labore ipsum eu sunt duis commodo labore non. Qui in officia anim elit dolor deserunt elit. Tempor elit labore eu irure sit ipsum non velit irure. Sit eiusmod cillum tempor sit ipsum ex ullamco est labore.'
        return await postService.createPost(content)
      }
      expect(createPostWithMoreThan280Chars).rejects.toThrow(
        'You cannot send a post which has more than 280 characters'
      )
    })

    test('creating content with less than or equal to 280 characters', () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)

      const createPostWithLessThanOrEqualTo280Chars = async () => {
        const content =
          'Duis voluptate labore est irure occaecat elit consectetur reprehenderit excepteur tempor cupidatat nulla quis. Voluptate ex qui labore ipsum eu sunt duis commodo labore non. Qui in officia anim elit dolor deserunt elit. Tempor elit labore eu irure sit ipsum non velit irure.'
        return await postService.createPost(content)
      }
      expect(createPostWithLessThanOrEqualTo280Chars).not.toThrow(
        'You cannot send a post which has more than 280 characters'
      )
    })

    test('should have id', async () => {
      const postRepository = getRepo()
      const postService = new PostService(postRepository)

      const postOne = await postService.createPost('Have a nice day')
      const postTwo = await postService.createPost('Thank you')

      expect(postOne).toHaveProperty('id')

      expect(postOne && postOne.id).not.toEqual(postTwo && postTwo.id)
    })
  })
}
