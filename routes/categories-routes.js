import { Router } from 'express'
import { isAuth } from '../middleware/auth.js'

const categoriesRouter = Router()
// All Category routes are protected routes
categoriesRouter.use(isAuth)

// Add new category
categoriesRouter.get('/new', (req, res) => {
  res.json({msg: 'Get route to get category form'})
})

export default categoriesRouter