import { IPost } from '@/post/entities/IPost'
import { IPostRepository } from '@/post/repositories/IPostRepository'
import assert from 'assert'
import { range } from 'lodash-es'

export const postRepoTest = (repoHook: () => () => IPostRepository) => {
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

    test('should use repository to find posts by id', async () => {
      const postRepository = getRepo()
      const posts = (await Promise.all(
        range(5).map((idx) => {
          return postRepository.create({
            content: `Post content ${idx}`
          })
        })
      )) as unknown as IPost[]

      const postIds = posts.map((post) => post.id)
      let foundPosts: IPost[]
      let postIdsToFind: IPost['id'][]

      postIdsToFind = [postIds[0], postIds[1]]
      foundPosts = await postRepository.findById(postIdsToFind)
      expect(foundPosts).toHaveLength(2)
      expect(foundPosts.every((post) => postIdsToFind.includes(post.id))).toBeTruthy()

      postIdsToFind = ['n234jfa', postIds[1]]
      foundPosts = await postRepository.findById(postIdsToFind)
      expect(foundPosts).toHaveLength(1)
      expect(foundPosts.every((post) => postIdsToFind.includes(post.id))).toBeTruthy()
      expect(postIdsToFind.every((id) => foundPosts.map((post) => post.id).includes(id))).toBeFalsy()

      postIdsToFind = ['asdgasv234', '2143gsdaf']
      foundPosts = await postRepository.findById(postIdsToFind)
      expect(foundPosts).toHaveLength(0)
    })

    test('should find comments using repository', async () => {
      const postRepository = getRepo()
      const post = await postRepository.create({ content: 'We deployed the latest feature to prod!' })
      const comment1 = await postRepository.create({ content: 'Hold my beer!', post })
      const comment2 = await postRepository.create({ content: 'Mine too!', post: comment1 })
      const comment3 = await postRepository.create({ content: '+1', post: comment1 })
      const comment4 = await postRepository.create({ content: 'Or maybe my Raki? :)', post: comment1 })

      const comment5 = await postRepository.create({ content: 'We have to celebrate this one!', post })
      const comment6 = await postRepository.create({ content: 'Where is the party?', post: comment5 })
      const comment7 = await postRepository.create({ content: 'At the office of course!!', post: comment6 })

      assert(post && comment1 && comment2 && comment3 && comment4 && comment5 && comment6 && comment7)

      let foundCommentsForPost: IPost[]
      let expectedCommentIds: IPost['id'][]

      foundCommentsForPost = await postRepository.findByParentId(post.id)
      expectedCommentIds = [comment1?.id, comment5.id]
      expect(foundCommentsForPost).toHaveLength(expectedCommentIds.length)
      expect(foundCommentsForPost.every((comment) => expectedCommentIds.includes(comment.id))).toBeTruthy()

      foundCommentsForPost = await postRepository.findByParentId(comment1.id)
      expectedCommentIds = [comment2.id, comment3.id, comment4.id]
      expect(foundCommentsForPost).toHaveLength(expectedCommentIds.length)
      expect(foundCommentsForPost.every((comment) => expectedCommentIds.includes(comment.id))).toBeTruthy()
      expect(
        expectedCommentIds.every((id) => foundCommentsForPost.map((comment) => comment.id).includes(id))
      ).toBeTruthy()

      foundCommentsForPost = await postRepository.findByParentId(comment5.id)
      expectedCommentIds = [comment6.id]
      expect(foundCommentsForPost).toHaveLength(expectedCommentIds.length)
      expect(foundCommentsForPost.every((comment) => expectedCommentIds.includes(comment.id))).toBeTruthy()
      expect(
        expectedCommentIds.every((id) => foundCommentsForPost.map((comment) => comment.id).includes(id))
      ).toBeTruthy()

      expect(
        [...expectedCommentIds, comment7.id].every((id) =>
          foundCommentsForPost.map((comment) => comment.id).includes(id)
        )
      ).toBeFalsy()

      let commentCounts = await postRepository.countByParentId(post.id)
      expect(commentCounts).toEqual(2)

      commentCounts = await postRepository.countByParentId(comment1.id)
      expect(commentCounts).toEqual(3)
    })

    test('should find next N item ids given a cursor', async () => {
      const postRepository = getRepo()
      const posts = await Promise.all(range(25).map((idx) => postRepository.create({ content: `Post content ${idx}` })))

      const first = 7
      assert(posts[first])
      const cursor = posts[first].id
      const limit = 5

      const nextPostIds = await postRepository.findNextNPostIdsAfter(limit, cursor)
      const expectedPostIds = posts.slice(first, first + limit).map((post) => post?.id)

      expect(nextPostIds.every((id, idx) => expectedPostIds[idx] === id))
    })
  })
}
