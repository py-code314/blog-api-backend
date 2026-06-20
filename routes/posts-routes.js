import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const postsRouter = Router()
// All Post routes are protected routes
postsRouter.use(isAuth)

// Add new post
postsRouter.get('/new', controllers.getNewPostForm)
postsRouter.post('/new', controllers.createNewPost)

// Show a specific post
postsRouter.get('/:postId', controllers.getPostById)

// Edit a specific post
postsRouter.get('/:postId/update', controllers.getEditPostForm)
postsRouter.put('/:postId/update', controllers.updatePost)

export { postsRouter }
