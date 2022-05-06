

import express from 'express'
import User from '../models/User'
import AuthorizeUser from '../lib/auth'
import multer from 'multer'

// const multer = require('multer')

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    console.log('reaches here')
    console.log('req.user : ', req.user)

    if (!req.user || !req.user._id) return

    cb(null, './src/public')
  },
  filename: function (req, file, cb) {

    const arr = file.originalname.split('.')

    const howdidyou = arr[arr.length - 1]

    const fileName = `ava-${req.user._id}.${howdidyou}`

    req.fileName = fileName

    cb(null, fileName)
  },
})

const upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!req.user || !req.user._id) return cb(null, false)

    cb(null, true)
  }
})

const router = express.Router()

router.get('/', async (req, res) => {

  const allUsers = deepClone(await User.findAll())

  allUsers.forEach(item => delete item.blogs)

  return res.status(200).json(allUsers)
})

router.post('/signup', async (req, res) => {
  
  try {

    if (!req.body.username || !req.body.name) return res.status(522).json({ msg: 'bad input' })

    const token = await User.signup({
      username: req.body.username,
      name: req.body.name,
    })

    if (!token) return res.status(500).json({ msg: 'oops, somethings wrong' })
    
    return res.status(200).json({ token })
    
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }

})

router.post('/login', async (req, res) => {
  try {

    if (!req.body.username) throw new Error('bad inputs')

    const token = await User.login({
      username: req.body.username,
      password: req.body.password
    })
    
    return res.status(200).json({ token })
    
  } catch (error) {
    res.status(522).json({ msg: error.message })
  }
})

router.post('/me', async (req, res, next) => {
  try {
    
    const user = await AuthorizeUser(req.user)

    if (!user || !user._id) throw new Error('Unathorized')

    return res.status(200).json(user)

  } catch (error) {
    return res.status(522).json({ msg: error.message })
  }
})

router.post('/edit', async (req, res, next) => {
  try {

    const thisUser = await AuthorizeUser(req.user)

    if (
      !req.body.name ||
      !req.body.bio ||
      typeof req.body.bio !== 'string' ||
      req.body.bio.length > 200
    ) throw new Error('bad input')

    const realData = {
      name: req.body.name,
      bio: req.body.bio
    }

    await User.findByIdAndUpdate(thisUser._id, realData)

    return res.status(200).json({ msg: 'ok' })

  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

router.post('/update-avatar', upload.single('avatar'), async (req, res, next) => {
  try {

    if (!req.fileName) throw new Error('somethings wrong')
    
    const thisUser = await AuthorizeUser(req.user)

    const realData = {
      avatar: req.fileName
    }

    await User.findByIdAndUpdate(thisUser._id, realData)

    return res.status(200).json({ msg: 'ok' })

    
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

router.get('/singleUser/:_id', async (req, res, next) => {
  try {

    const thisUser = await User.findById(req.params._id)

    if (!thisUser || !thisUser._id) throw new Error('bad request: no such user exists')

    return res.json(thisUser)
    
  } catch (error) {
    return res.status(500).json({msg: error.message})
  }
})

router.get('/top-users', async (req,res,next) => {
  try {
    const theseUsers = deepClone(await User.getTopUsers())

    theseUsers.forEach(user => delete user.blogs)

    return res.status(200).json(theseUsers)
    
  } catch (error) {
    return res.status(500).json({ msg: error.message })
  }
})

export default router



