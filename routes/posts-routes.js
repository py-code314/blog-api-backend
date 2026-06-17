import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'

const postsRouter = Router()

// New post routes
postsRouter.get('/new', controllers.post_get)

export { postsRouter }
