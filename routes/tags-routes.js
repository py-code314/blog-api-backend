import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const tagsRouter = Router()

/* For author frontend */
// Add new tag
tagsRouter.post('/new', isAuth, controllers.createNewTag)

/* For author frontend */
// Show all tags by a specific author
tagsRouter.get('/me', isAuth, controllers.getTagsByAuthor)

/* For reader frontend */
// Show all tags by all authors
tagsRouter.get('/all', controllers.getAllTags)

/* For author frontend */
// Get a tag by id
tagsRouter.get('/:tagId', isAuth, controllers.getTagById)
// Update a tag
tagsRouter.post('/:tagId/update', isAuth, controllers.updateTag)
// Delete a tag
tagsRouter.delete('/:tagId/delete', isAuth, controllers.deleteTag)

export default tagsRouter
