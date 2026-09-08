import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const postsRouter = Router()
// All Post routes are protected routes
// postsRouter.use(isAuth)

// Add new post
postsRouter.get('/new', isAuth, controllers.getNewPostForm)
postsRouter.post('/new', isAuth, controllers.createNewPost)

// Get all author posts
postsRouter.get('/me', isAuth, controllers.getAuthorPosts)
// Get all author published posts
postsRouter.get('/me/published', isAuth, controllers.getAuthorPublishedPosts)
// Get all author unpublished posts
postsRouter.get('/me/drafts', isAuth, controllers.getAuthorDrafts)
// Get all public posts
postsRouter.get('/', controllers.getPublicPosts)
// Get 2 most recent posts
postsRouter.get('/recent', controllers.getRecentPosts)


// Get a specific post
postsRouter.get('/me/:postId', isAuth, controllers.getAuthorPostById)
postsRouter.get('/:postId', controllers.getPublicPostById)

// Update a specific post
postsRouter.get('/:postId/update', isAuth, controllers.getEditPostForm)
postsRouter.post('/:postId/update', isAuth, controllers.updatePost)
// postsRouter.put('/:postId/update', isAuth, controllers.updatePost)

// Delete a post
postsRouter.delete('/:postId/delete', isAuth, controllers.deletePost)

export default postsRouter
