type Post = {
  id: number
  content: string
  createdAt: Date
}

let postId = 0
export const createPost = (content?: string): Post | undefined => {
  if (!content) throw new Error('Content cannot be empty')
  if (content && content.length > 280) throw new Error('You cannot send a post which has more than 280 characters')

  const post: Post = { id: postId, content: content, createdAt: new Date() }
  postId++

  return post
}
