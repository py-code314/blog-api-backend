import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const statsRouter = Router()

/* For author frontend */
// Get stats for posts, categories, and tags
statsRouter.get('/', isAuth, controllers.getAllStats)

export default statsRouter
