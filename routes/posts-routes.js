import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const postsRouter = Router()
// All Post routes are protected routes
// postsRouter.use(isAuth)

// Add new post
postsRouter.get('/new', isAuth, controllers.getNewPostForm)
postsRouter.post('/new', isAuth, controllers.createNewPost)

// Show a specific post
postsRouter.get('/:postId', controllers.getPostById)

// Update a specific post
postsRouter.get('/:postId/update', isAuth, controllers.getEditPostForm)
postsRouter.put('/:postId/update', isAuth, controllers.updatePost)

// Delete a post
postsRouter.delete('/:postId/delete', isAuth, controllers.deletePost)

export default postsRouter 
