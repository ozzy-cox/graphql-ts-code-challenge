import * as fs from 'fs'

export class BaseFileRepository<T> {
  protected fileName: string
  protected data: {
    // This can create duplicate id's since we have no concurrency control for files
    // But this is enough for POC
    metaData: { lastId: number }
    table: T[]
  }
  constructor(fileName: string) {
    this.fileName = fileName
    try {
      this.data = JSON.parse(fs.readFileSync(fileName, 'utf-8'))
    } catch (error) {
      this.data = {
        metaData: {
          lastId: 0
        },
        table: []
      }
    }
  }

  persist() {
    fs.writeFileSync(this.fileName, JSON.stringify(this.data))
  }
}
