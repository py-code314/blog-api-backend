import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const tagsRouter = Router()
// All Tag routes are protected routes
tagsRouter.use(isAuth)

// Add new tag
tagsRouter.get('/new', controllers.getNewTagForm)

export default tagsRouter
