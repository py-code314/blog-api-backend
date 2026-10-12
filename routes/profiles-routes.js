import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const profilesRouter = Router()

/* Routes to manage 'bio' field in Profile */
/* Using in only author frontend for now */
// Add new profile
profilesRouter.post('/new', isAuth, controllers.createNewProfile)

/* For author frontend */
// Get self profile
profilesRouter.get('/me', isAuth, controllers.getMyProfile)

/**
 * --------------  Not using these endpoint yet ----------------
 */

// Show a specific profile by profile id
profilesRouter.get('/:profileId', controllers.getProfileById)
// Update a specific profile
profilesRouter.put('/:profileId/update', isAuth, controllers.updateProfile)
// Delete a profile
profilesRouter.delete('/:profileId/delete', isAuth, controllers.deleteProfile)

export default profilesRouter
