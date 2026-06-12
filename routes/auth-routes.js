import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'

const signupRouter = Router()
const loginRouter = Router()

/* Sign up routes */
signupRouter.get('/', controllers.sign_up_get)
signupRouter.post('/', controllers.sign_up_post)

/* Log in routes */
loginRouter.get('/', controllers.log_in_get)
loginRouter.post('/', controllers.log_in_post)

export { signupRouter, loginRouter }
