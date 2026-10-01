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

/* For reader frontend */
// Get all public posts by all authors
postsRouter.get('/', controllers.getPublicPosts)

/* For author frontend */
// Get 2 most recent posts by author
postsRouter.get('/recent', isAuth, controllers.getRecentPosts)

/* For reader frontend */
// Get 3 most recent published posts by all authors
postsRouter.get('/feed/latest', controllers.getLatestPosts)

/* These routes are for reader frontend */
// Get all public posts by all authors by author id
postsRouter.get('/authors/:authorId', controllers.getPostsByAuthorId)
// Get all public posts by all authors by category
postsRouter.get('/categories/:categoryId', controllers.getPostsByCategoryId)
// Get all public posts by all authors by tag
postsRouter.get('/tags/:tagId', controllers.getPostsByTagId)


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
