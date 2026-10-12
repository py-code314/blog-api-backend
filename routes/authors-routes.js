import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'

const authorsRouter = Router()

/* For reader frontend */
// Get all authors
authorsRouter.get('/all', controllers.getAllAuthors)

export default authorsRouter
