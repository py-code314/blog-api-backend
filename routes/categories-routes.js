import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const categoriesRouter = Router()
// All Category routes are protected routes
categoriesRouter.use(isAuth)

// Add new category
categoriesRouter.get('/new', controllers.getNewCategoryForm)
categoriesRouter.post('/new', controllers.createNewCategory)

// Show all categories
categoriesRouter.get('/all', controllers.getAllCategories)

export default categoriesRouter