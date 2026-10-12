import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const categoriesRouter = Router()

// Add new category
categoriesRouter.post('/new', isAuth, controllers.createNewCategory)

// Show all categories
categoriesRouter.get('/all', controllers.getAllCategories)

// Get a category
categoriesRouter.get('/:categoryId', isAuth, controllers.getCategoryById)

// Update a category
categoriesRouter.post('/:categoryId/update', isAuth, controllers.updateCategory)

// Delete a category
categoriesRouter.delete(
  '/:categoryId/delete',
  isAuth,
  controllers.deleteCategory
)

export default categoriesRouter
