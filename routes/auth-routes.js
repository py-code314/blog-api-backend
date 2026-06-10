import { Router } from 'express'


const signupRouter = Router()

/* Sign up routes */
signupRouter.get('/', (req, res) => {
  return res.send('GET HTTP method for signup')
})
signupRouter.post('/', (req, res) => {
  return res.send('POST HTTP method for signup')
})

export default signupRouter
