import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const statsRouter = Router()


// Get stats for posts, categories, and tags
statsRouter.get('/all', isAuth, controllers.getAllStats)


export default statsRouter
