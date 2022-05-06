import { writeFileSync, readdirSync, existsSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'

const commentDirectory = path.join(process.cwd(), '/src/db/comments')

class CommentSchema {

  constructor() {
    this.cache = null
    this.doesCacheneedsUpdate = true
  }

  async create({ text, blogId, userId }) {
    try {

      if (!text || !blogId || !userId) throw new Error('bad request: bad input')
      
      const thisComment = {
        _id: `btc-${UID()}`,
        text,
        blogId,
        userId,
        createdAt: new Date().toISOString()
      }

      if (!existsSync(commentDirectory)) {
        mkdirSync(commentDirectory)
      }
      
      writeFileSync(path.join(commentDirectory, `${thisComment._id}.txt`), JSON.stringify(thisComment), "utf8")

      this.doesCacheneedsUpdate = true
      return thisComment

    } catch (error) {
      throw error
    }
  }

  async findAll() {
    try {

      if (!this.doesCacheneedsUpdate && this.cache) return this.cache
      
      const result = readdirSync(commentDirectory).map(item => {
        return JSON.parse(readFileSync(path.join(commentDirectory, item), {
          encoding: "utf8",
        }),)
      })
      
      this.cache = result
      this.doesCacheneedsUpdate = false
      
      return result

    } catch (error) {
      return []
    }
  }

  async getBlogComments(blogId) {
    try {
      
      const allblogs = await this.findAll()

      return allblogs.filter(item => item.blogId == blogId)

    } catch (error) {
      return []
    }
  }

}

const Comment = new CommentSchema()

export default Comment