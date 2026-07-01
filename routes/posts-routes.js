import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const postsRouter = Router()
// All Post routes are protected routes
// postsRouter.use(isAuth)

// Add new post
postsRouter.get('/new', isAuth, controllers.getNewPostForm)
postsRouter.post('/new', isAuth, controllers.createNewPost)

// ? Should I change the order
// Get all public posts
postsRouter.get('/', controllers.getPublicPosts)
// Get all author posts
postsRouter.get('/me', isAuth, controllers.getAuthorPosts)
// Get a specific post
// ? Should I change the order
postsRouter.get('/:postId', controllers.getPublicPostById)
postsRouter.get('/:postId/me', isAuth, controllers.getAuthorPostById)
// postsRouter.get('/:postId', controllers.getPostById)

// Update a specific post
postsRouter.get('/:postId/update', isAuth, controllers.getEditPostForm)
postsRouter.put('/:postId/update', isAuth, controllers.updatePost)

// Delete a post
postsRouter.delete('/:postId/delete', isAuth, controllers.deletePost)

export default postsRouter 
