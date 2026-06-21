import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const commentsRouter = Router()
// All Comment routes are protected routes
commentsRouter.use(isAuth)

// Add new comment
commentsRouter.get('/new', controllers.getNewCommentForm)

export {commentsRouter}