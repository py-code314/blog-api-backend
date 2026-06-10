import { Router } from 'express'
import { sign_up_get, sign_up_post } from '../controllers/auth-controller.js'

const signupRouter = Router()

/* Sign up routes */
signupRouter.get('/', sign_up_get)
signupRouter.post('/', sign_up_post)

export default signupRouter
