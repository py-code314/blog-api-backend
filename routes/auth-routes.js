import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'

const signupRouter = Router()
const loginRouter = Router()

/* Sign up routes */
signupRouter.post('/', controllers.registerUser)

/* Log in routes */
loginRouter.post('/', controllers.loginUser)

export { signupRouter, loginRouter }
