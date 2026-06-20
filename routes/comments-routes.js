import { Router } from 'express'
import { isAuth } from '../middleware/auth.js'

const commentsRouter = Router()
// All Comment routes are protected routes
commentsRouter.use(isAuth)

// Add new comment
commentsRouter.get('/new', (req, res) => {
  res.json({msg: 'Get form to add a comment'})
})

export {commentsRouter}