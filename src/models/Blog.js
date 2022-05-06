

import { writeFileSync, readdirSync, existsSync, mkdirSync, readFileSync } from 'fs'
import path from 'path'

const blogDirectoy = path.join(process.cwd(), '/src/db/blogs')

class BlogSchema {

  constructor() {
    this.cache = null
    this.doesCacheneedsUpdate = true
  }

  async create({ title, content, creatorId, imgurl }) {
    try {

      if (!title || !content || !creatorId || !imgurl) throw new Error('bad input')
      
      const thisBlog = {
        _id: `btb-${UID()}`,
        title,
        content,
        creatorId,
        imgurl,
        averageScore: 0,
        scores: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (!existsSync(blogDirectoy)) {
        mkdirSync(blogDirectoy)
      }
      
      writeFileSync(path.join(blogDirectoy, `${thisBlog._id}.txt`), JSON.stringify(thisBlog), "utf8")
      this.doesCacheneedsUpdate = true

      return thisBlog

    } catch (error) {
      throw error
    }
  }


  async findAll() {
    try {

      if (!this.doesCacheneedsUpdate && this.cache) return this.cache

      const result = readdirSync(blogDirectoy).map(item => {
        const thatBlog = JSON.parse(readFileSync(path.join(blogDirectoy, item), {
          encoding: "utf8",
        }))

        return thatBlog
      })

      // const result = JSON.parse(y);
      
      this.cache = result
      this.doesCacheneedsUpdate = false
      
      return result

    } catch (error) {
      console.log('error in find all')
      console.log(error)
      return []
    }
  }

  async findById(_id) {
    try {

      return (await this.findAll()).find(item => item._id == _id)

    } catch (error) {
      throw error
    }
  }

  async getBlogsByUserID(_id) {
    return (await this.findAll()).filter(({ creatorId }) => creatorId == _id)
  }

  async findByIdAndUpdate(_id, data) {

    try {

      const thisBlog = await this.findById(_id)

      Object.entries(data).forEach(([key, value]) => thisBlog[key] = value)

      thisBlog.updatedAt = new Date().toISOString()

      writeFileSync(path.join(blogDirectoy, `${thisBlog._id}.txt`), JSON.stringify(thisBlog), "utf8")
      this.doesCacheneedsUpdate = true

      return 'ok'

    } catch (error) {
      throw error
    }
    
  }

  async rateBlog({ blogId, userId, score }) {
    try {

      if (!blogId || !score) throw new Error('bad request: bad input')
      
      const thisBlog = await this.findById(blogId)

      if (!thisBlog || !thisBlog._id) throw new Error('bad request: no such blog exists')

      console.log(thisBlog)

      thisBlog.scores[userId] = score
      const arr = Object.entries(thisBlog.scores)
      const averageScore = arr.reduce((acc, [_, value]) => {
        return acc + value
      }, 0) / arr.length
      thisBlog.averageScore = averageScore

      writeFileSync(path.join(blogDirectoy, `${thisBlog._id}.txt`), JSON.stringify(thisBlog), "utf8")
      this.doesCacheneedsUpdate = true

      return 'ok'


    } catch (error) {
      throw error
    }
  }


  async getTopBlogs() {
    try {

      return deepClone(await this.findAll()).sort((a, b) => b.averageScore - a.averageScore).slice(0, 3)

    } catch (error) {
      return []
    }
  }
}

const BlogModel = new BlogSchema()

export default BlogModel