import { Router } from 'express'
import * as controllers from '../controllers/index-controller.js'
import { isAuth } from '../middleware/auth.js'

const categoriesRouter = Router()
// All Category routes are protected routes
// categoriesRouter.use(isAuth)

// Add new category
categoriesRouter.get('/new', isAuth, controllers.getNewCategoryForm)
categoriesRouter.post('/new', isAuth, controllers.createNewCategory)

// Show all categories
categoriesRouter.get('/all', controllers.getAllCategories)

// Get a category
categoriesRouter.get('/:categoryId', isAuth, controllers.getCategoryById)

// Update a category
categoriesRouter.get('/:categoryId/update', isAuth, controllers.getEditCategoryForm)
categoriesRouter.post('/:categoryId/update', isAuth, controllers.updateCategory)
// categoriesRouter.put('/:categoryId/update', isAuth, controllers.updateCategory)

// Delete a category
categoriesRouter.delete('/:categoryId/delete', isAuth, controllers.deleteCategory)


export default categoriesRouter