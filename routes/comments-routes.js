import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const commentsRouter = Router({ mergeParams: true })
// All Comment routes are protected routes
commentsRouter.use(isAuth)

// Add new comment
commentsRouter.get('/new', controllers.getNewCommentForm)
commentsRouter.post('/new', controllers.createNewComment)

// * Add route to get a specific comment later if needed

// Update a specific post
commentsRouter.get('/:commentId/update', controllers.getEditCommentForm)

export { commentsRouter }
