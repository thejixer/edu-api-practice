import express from 'express'
import Blog from '../models/Blog'
import AuthorizeUser from '../lib/auth'
import User from '../models/User'

const router = express.Router()

router.post('/write', async (req, res, next) => {

  try {

    if (!req.body.title || !req.body.content || !req.body.imgurl) return res.status(522).json({ msg: 'bad request: bad inputs' })

    const thisUser = await AuthorizeUser(req.user)

    const thisBlog = await Blog.create({ ...req.body, creatorId: thisUser._id })
    
    User.pushBlogtoUser(thisUser._id, thisBlog._id)

    return res.status(200).json({ msg: 'ok', _id: thisBlog._id })
    
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }

})

router.get('/', async (req, res) => {
  try {
    const users = await User.findAll()
    const obj = {}
    users.forEach(user => obj[user._id] = user)
    const blogs = deepClone(await Blog.findAll())
    blogs.forEach(blog => {
      blog.creator = obj[blog.creatorId]
      delete blog.scores
    })
  
  
  
    return res.json(blogs)
  } catch (error) {
    return res.status(500).json({msg: error.message})
  }
})

router.get('/my-blogs', async (req, res, next) => {

  try {
    const thisUser = await AuthorizeUser(req.user)

    const theseBlogs = deepClone(await Blog.getBlogsByUserID(thisUser._id))

    theseBlogs.forEach(item => delete item.scores)

    return res.json(theseBlogs)

  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

router.get('/single-blog/:_id', async (req, res, next) => {

  try {
    const thisBlog = deepClone(await Blog.findById(String(req.params._id)))

    if (!thisBlog) return res.status(500).json({ msg: 'bad request: no such blog exists' })
  
    const thisUser = await User.findById(thisBlog.creatorId)
  
    thisBlog.creator = thisUser
    delete thisBlog.scores
  
    return res.json(thisBlog)
  } catch (error) {
    return res.status(500).json({msg: error.message})
  }
})

router.post('/by-user', async (req, res, next) => {
  try {

    const thisUser = await User.findById(req.body._id)

    if (!thisUser || !thisUser._id) throw new Error('bad request: no such user exists')
    
    const theseBlogs = deepClone(await Blog.getBlogsByUserID(thisUser._id))

    theseBlogs.forEach(item => delete item.scores)
    
    return res.status(200).json(theseBlogs)
    
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

router.post('/edit', async (req, res, next) => {
  try {

    if (!req.body.blogId || !req.body.data) throw new Error('bad request: bad inputs')

    const realData = {
      title: req.body.data.title,
      content: req.body.data.content,
      imgurl: req.body.data.imgurl
    }
    
    const thisUser = await AuthorizeUser(req.user)
    const thisBlog = await Blog.findById(req.body.blogId)

    if (thisBlog.creatorId !== thisUser._id) throw new Error('unathorized')

    await Blog.findByIdAndUpdate(thisBlog._id, realData)

    return res.status(200).json({ msg: 'ok' })

  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

router.post('/submit-rate', async (req, res, next) => {
  try {

    const thisUser = await AuthorizeUser(req.user)

    await Blog.rateBlog({
      blogId: req.body.blogId,
      userId: thisUser._id,
      score: req.body.score
    })
    
    await User.calculateUserScore(thisUser._id)
    return res.status(200).json({msg: 'ok'})

  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

router.get('/top-blogs', async (req,res,next) => {
  try {

    const theseBlogs = deepClone(await Blog.getTopBlogs())

    theseBlogs.forEach(item => delete item.scores)

    return res.status(200).json(theseBlogs)
    
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

export default router



