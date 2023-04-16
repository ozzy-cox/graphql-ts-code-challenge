import { InMemoryPostRepository } from '@/repositories/EntityRepository'
import { testCreatingPosts, testListingPosts } from './Post.test'

testCreatingPosts(new InMemoryPostRepository())
testListingPosts(new InMemoryPostRepository())
