import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const profilesRouter = Router()
// All Profile routes are protected routes
profilesRouter.use(isAuth)

// Add new profile
profilesRouter.get('/new', controllers.getNewProfileForm)
profilesRouter.post('/new', controllers.createNewProfile)

// Show a specific profile
profilesRouter.get('/:profileId', controllers.getProfileById)

export { profilesRouter }