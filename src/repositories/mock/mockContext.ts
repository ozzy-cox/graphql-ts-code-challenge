import { PostController } from '@/entities/Post'
import { Reaction, ReactionController } from '@/entities/Reaction'
import { Context } from '@/lib/gql/context'
import { Post } from '@/lib/orm/models/Post'
import { MockListableRepository, MockRepository } from '@/repositories/mock/InMemoryRepo'

export const mockContext = (): Context => ({
  postController: new PostController(new MockListableRepository<Post>()),
  reactionController: new ReactionController(new MockRepository<Reaction>())
})
