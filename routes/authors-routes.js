import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
// import { isAuth } from '../middleware/auth.js'

const authorsRouter = Router()

// Get all authors
authorsRouter.get('/all', controllers.getAllAuthors)

export default authorsRouter
