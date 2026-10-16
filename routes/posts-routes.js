import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const postsRouter = Router()

/* For author frontend */
// Add new post
postsRouter.post('/new', isAuth, controllers.createNewPost)

/* For reader frontend */
// Get all public posts by all authors
postsRouter.get('/', controllers.getPublicPosts)

/* For author frontend */
// Get all single author's posts
postsRouter.get('/me', isAuth, controllers.getAuthorPosts)
// Get all single author's published posts
postsRouter.get('/me/published', isAuth, controllers.getAuthorPublishedPosts)
// Get all single author's unpublished posts
postsRouter.get('/me/drafts', isAuth, controllers.getAuthorDrafts)

/* For author frontend */
// Get 2 most recent posts by author
postsRouter.get('/recent', isAuth, controllers.getRecentPosts)

/* For reader frontend */
// Get 3 most recent published posts by all authors
postsRouter.get('/latest', controllers.getLatestPosts)

/* These routes are for reader frontend */
// Get all public posts by author id
postsRouter.get('/authors/:authorId', controllers.getPostsByAuthorId)
// Get all public posts by any author by category slug
postsRouter.get('/categories/slug/:categorySlug', controllers.getPostsByCategorySlug)
// Get all public posts by any author by category id
postsRouter.get('/categories/:categoryId', controllers.getPostsByCategoryId)
// Get all public posts by any author by tag name
postsRouter.get('/tags/name/:tagName', controllers.getPostsByTagName)
// Get all public posts by any author by tag id
postsRouter.get('/tags/:tagId', controllers.getPostsByTagId)

/* Get a specific post */
// For author frontend
postsRouter.get('/me/:postId', isAuth, controllers.getAuthorPostById)
// For reader frontend
postsRouter.get('/:postId', controllers.getPublicPostById)

/* For author frontend */
// Update a specific post
postsRouter.post('/:postId/update', isAuth, controllers.updatePost)

/* For author frontend */
// Delete a post
postsRouter.delete('/:postId/delete', isAuth, controllers.deletePost)

export default postsRouter
