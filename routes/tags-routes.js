import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const tagsRouter = Router()
// tagsRouter.use(isAuth)

// Add new tag
tagsRouter.get('/new',isAuth, controllers.getNewTagForm)
tagsRouter.post('/new',isAuth, controllers.createNewTag)

// Show all tags by author
tagsRouter.get('/all',isAuth, controllers.getAllTags)
// Show all public tags
tagsRouter.get('/public', controllers.getAllPublicTags)

// Get a tag
tagsRouter.get('/:tagId', isAuth, controllers.getTagById)

// Update a tag
tagsRouter.get('/:tagId/update', isAuth, controllers.getEditTagForm)
tagsRouter.post('/:tagId/update',isAuth, controllers.updateTag)
// tagsRouter.put('/:tagId/update', controllers.updateTag)

// Delete a tag
tagsRouter.delete('/:tagId/delete',isAuth, controllers.deleteTag)

export default tagsRouter
