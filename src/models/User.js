
import { writeFileSync, existsSync, mkdirSync, readFileSync, readdirSync } from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import Blog from './Blog'

const userDirectory = path.join(process.cwd(), '/src/db/users')

class UserSchema {

  constructor() {
    this.cache = null
    this.doesCacheneedsUpdate = true
  }

  async signup({ username, name }) {
    
    try {
      if (!name || !username) throw new Error('bad input')

      const allUsers = await this.findAll()

      const userAlreadyExists = allUsers.some(user => user.username == username)

      if (userAlreadyExists) throw new Error('this username already exists in the database')

      const thisUser = {
        _id: `btu-${UID()}`,
        username,
        name,
        bio: '',
        blogs: [],
        avatar: '',
        averageScore: 0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      if (!existsSync(userDirectory)) {
        mkdirSync(userDirectory)
      }

      const thisUserDirectory = path.join(userDirectory, `${thisUser._id}`)

      if (!existsSync(path.join(thisUserDirectory))) {
        mkdirSync(path.join(thisUserDirectory))
      }

      writeFileSync(path.join(thisUserDirectory, 'info.txt'), JSON.stringify(thisUser), "utf8")
      this.doesCacheneedsUpdate = true

      console.log('hmmm')
      return this.createToken(thisUser._id)

    } catch (error) {
      console.log(error)
      throw error
    }
  }

  async findAll() {
    try {

      if (!this.doesCacheneedsUpdate && this.cache) return this.cache

      const result = readdirSync(userDirectory).map(item => {
        return JSON.parse(readFileSync(path.join(userDirectory, `/${item}/info.txt`), {
          encoding: "utf8",
        }))
        // return thisUser
      })
      
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

      const thisUser = (await this.findAll()).find(item => item._id == _id)
      
      if (!thisUser || !thisUser._id) throw new Error('bad request: no such user found')

      return thisUser

    } catch (error) {
      throw error
    }
  }

  async findByUserName(username) {
    try {
      const thisUser = (await this.findAll()).find(user => user.username === username)
      if (!thisUser || !thisUser._id) throw new Error('bad request: no such user exists')
      return thisUser
    } catch (error) {
      throw error
    }
  }

  createToken(_id) {
    return jwt.sign(
      {
        _id,
      },
      'SECRET'
    )
  }

  async login({ username, password }) {
    try {

      const thisUser = await this.findByUserName(username)

      if (!thisUser || !thisUser._id) throw new Error('bad request: no such user exists')

      if (password !== '1111') throw new Error('password doesnt match')

      return this.createToken(thisUser._id)

    } catch (error) {
      throw error
    }
  }

  async findByIdAndUpdate(_id, data) {

    try {
      
      const thisUser = await this.findById(_id)

      Object.entries(data).forEach(([key, value]) => thisUser[key] = value)

      thisUser.updatedAt = new Date().toISOString()

      writeFileSync(path.join(userDirectory, `${thisUser._id}/info.txt`), JSON.stringify(thisUser), "utf8")

      return 'ok'

    } catch (error) {
      throw error
    }
    
  }

  async pushBlogtoUser(_id, blogId) {
    const thisUser = await this.findById(_id)

    thisUser.blogs.push(blogId)

    writeFileSync(path.join(userDirectory, `${thisUser._id}/info.txt`), JSON.stringify(thisUser), "utf8")

  }
  
  async calculateUserScore(userId) {
    try {
      const thisUser = deepClone(await this.findById(userId))

      if (!thisUser || !thisUser._id) throw new Error('bad request: no such user exists')

      const theseBlogs = await Blog.getBlogsByUserID(thisUser._id)

      const userScore = (theseBlogs.reduce((acc, cur) => acc + cur.averageScore, 0) / theseBlogs.length);
      
      thisUser.averageScore = userScore

      writeFileSync(path.join(userDirectory, `${thisUser._id}/info.txt`), JSON.stringify(thisUser), "utf8")

      // return 'ok'
    } catch (error) {
      console.log(error)
      // do nothing
    }
  }

  async getTopUsers() {
    try {
      const theseUsers = deepClone(await this.findAll())

      return theseUsers.sort((a, b) => b.averageScore - a.averageScore).slice(0, 3)

    } catch (error) {
      return []
    }
  }
}

const UserModel = new UserSchema()

export default UserModel