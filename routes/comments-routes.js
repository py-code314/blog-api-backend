import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const commentsRouter = Router({ mergeParams: true })
// All Comment routes are protected routes
commentsRouter.use(isAuth)

/* For reader frontend */
// Add new comment
commentsRouter.post('/new', controllers.createNewComment)
// Update a specific comment
commentsRouter.post('/:commentId/update', controllers.updateComment)
// Delete a comment by id
commentsRouter.delete('/:commentId/delete', controllers.deleteComment)

export default commentsRouter 
