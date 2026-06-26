import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'

const signupRouter = Router()
const loginRouter = Router()

/* Sign up routes */
signupRouter.get('/', controllers.getSignupForm)
signupRouter.post('/', controllers.registerUser)

/* Log in routes */
loginRouter.get('/', controllers.getLoginForm)
loginRouter.post('/', controllers.loginUser)

export { signupRouter, loginRouter }
