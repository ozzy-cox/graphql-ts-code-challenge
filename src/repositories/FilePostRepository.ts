import { RepositoryInterface } from './RepositoryInterface'
import { Post } from '../entities/Post'
import { BaseFileRepository } from './BaseRepository'

export class FilePostRepository extends BaseFileRepository<Post> implements RepositoryInterface<Post> {
  constructor(fileName: string) {
    super(fileName)
  }

  create(param: Omit<Post, 'id' | 'createdAt'>) {
    return new Promise<Post>((resolve, reject) => {
      const post: Post = {
        id: this.data.metaData.lastId + 1,
        content: param.content,
        createdAt: new Date()
      }
      resolve(post)
    })
  }
}
