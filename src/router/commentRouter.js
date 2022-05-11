import express from 'express'
import Comment from '../models/Comment'
import Blog from '../models/Blog'
import User from '../models/User'
import AuthorizeUser from '../lib/auth'

const router = express.Router()

router.post('/submit', async (req, res, next) => {
  try {
    
    if (!req.body.text || !req.body.blogId) throw new Error('bad request: bad inputs')

    const thisBlog = await Blog.findById(req.body.blogId)

    if (!thisBlog || !thisBlog._id) throw new Error('bad request: no such blog found')

    const thisUser = await AuthorizeUser(req.user)

    await Comment.create({
      ...req.body,
      userId: thisUser._id
    })

    return res.status(200).json({ msg: 'ok' })
    
  } catch (error) {
    return res.json({ msg: error.message })
  }
})

router.get('/by-blog/:blogId', async (req, res, next) => {
  
  try {

    const thisBlog = await Blog.findById(req.params.blogId)

    if (!thisBlog || !thisBlog._id) throw new Error('bad request: no such blog exists')

    const theseComments = deepClone(await Comment.getBlogComments(thisBlog._id))
    const allUsers = await User.findAll()
    const userCache = {}

    allUsers.forEach(user => userCache[user._id] = user)

    theseComments.forEach((item, i) => {
      delete item.blogId
      theseComments[i].user = userCache[item.userId]
    })

    return res.status(200).json(theseComments)
    
  } catch (error) {
    return res.json({ msg: error.message })
  }
})

export default router;