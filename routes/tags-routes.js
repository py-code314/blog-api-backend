import { Router } from 'express'
import { isAuth } from '../middleware/auth.js'

const tagsRouter = Router()
// All Tag routes are protected routes
tagsRouter.use(isAuth)

// Add new tag
tagsRouter.get('/new', (req, res) => {
  res.json({msg: 'Get route to show tag form'})
})

export default tagsRouter
