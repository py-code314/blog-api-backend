import { Router } from 'express'
import { sign_up_get } from '../controllers/auth-controller.js'

const signupRouter = Router()

/* Sign up routes */
signupRouter.get('/', sign_up_get)
signupRouter.post('/', (req, res) => {
  return res.send('POST HTTP method for signup')
})

export default signupRouter
