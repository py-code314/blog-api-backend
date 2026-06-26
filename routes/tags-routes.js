import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const tagsRouter = Router()
// All Tag routes are protected routes
tagsRouter.use(isAuth)

// Add new tag
tagsRouter.get('/new', controllers.getNewTagForm)
tagsRouter.post('/new', controllers.createNewTag)

// Show all tags
tagsRouter.get('/all', controllers.getAllTags)

// Update a tag
tagsRouter.get('/:tagId/update', controllers.getEditTagForm)

export default tagsRouter
