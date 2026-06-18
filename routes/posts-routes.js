import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const postsRouter = Router()
// All Post routes are protected routes
postsRouter.use(isAuth)

// New post routes
postsRouter.get('/new', controllers.post_get)
postsRouter.post('/new', (req, res) => {
  res.send('Post a new blog post')
})

export { postsRouter }
