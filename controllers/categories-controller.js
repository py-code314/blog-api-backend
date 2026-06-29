import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'

import BadRequestError from '../errors/request-error.js'
import RecordNotFoundError from '../errors/resource-error.js'
import AuthorizationError from '../errors/authorization-error.js'
import verifyToken from '../utils/verify-token.js'

/* Error messages */
const emptyErr = 'can not be empty.'
const alphanumericErr =
  'can only contain letters, numbers, spaces, and characters -(hyphen), &(ampersand).'

/* Validate category */
const validateCategory = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(`Name ${emptyErr}`)
    .bail()
    .isAlphanumeric('en-US', { ignore: '- &' })
    .withMessage(`Name ${alphanumericErr}`),
]

/* Show category form */
async function getNewCategoryForm(req, res) {
  res.json({
    success: true,
    title: 'New Category',
    msg: 'Get new category form',
  })
}

/* Validate and create new category */
const createNewCategory = [
  validateCategory,

  async (req, res, next) => {
    // Get form data
    const { name } = req.body

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        title: 'New Category',
        category: { name },
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { name } = matchedData(req)
      const userId = req.user.id
      // TODO: Add post id when a category is added to a post
      // Add category to db
      const category = await prisma.category.create({
        data: {
          name,
          user: {
            connect: { id: userId },
          },
        },
      })
      return res.json({
        success: true,
        category,
      })
    } catch (err) {
      // User id doesn't match in query
      if (err.code === 'P2025') {
        const invalidUser = new AuthorizationError(
          'You do not have permission to create a new category. Please log in and try again.'
        )
        return next(invalidUser)
      }
      return next(err)
    }
  },
]

/* Get all categories */
async function getAllCategories(req, res, next) {
  try {
    // Get user id
    const userData = await verifyToken(req)
    const userId = userData?.sub

    // Visitor
    let queryOptions = {
      orderBy: {
        updatedAt: 'desc',
      },
    }

    // Logged in user gets their own categories
    if (userId) {
      queryOptions.where = { userId }
    }

    // Get all categories
    const categories = await prisma.category.findMany(
      queryOptions
    )

    return res.json({
      success: true,
      categories,
    })
  } catch (err) {
    return next(err)
  }
}

/* Get category data for editing */
async function getEditCategoryForm(req, res, next) {
  try {
    const userId = req.user.id
    const categoryId = Number(req.params.categoryId)
    const isInt = Number.isInteger(categoryId)

    // Make sure categoryId is a number
    if (!isInt) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Get category by id
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    })

    // Category is not found
    if (!category) {
      const invalidCategory = new RecordNotFoundError(
        'The category you want to edit no longer exists.'
      )
      return next(invalidCategory)
    }

    // User not created the category
    if (category.userId !== userId) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to edit this category.'
      )
      return next(invalidUser)
    }

    res.json({
      success: true,
      title: 'Edit Category',
      category,
    })
  } catch (err) {
    return next(err)
  }
}

/* Validate and update a category */
const updateCategory = [
  validateCategory,

  async (req, res, next) => {
    // Get form data
    const { name } = req.body

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        title: 'Edit Category',
        category: {name},
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { name } = matchedData(req)
      const userId = req.user.id
      const categoryId = Number(req.params.categoryId)
      const isInt = Number.isInteger(categoryId)

      // Make sure categoryId is a number
      if (!isInt) {
        const badRequest = new BadRequestError(
          'The web address looks invalid. Please check the URL and try again.'
        )
        return next(badRequest)
      }

      // Get category by category id and user id to make sure only author can edit it
      const category = await prisma.category.update({
        where: {
          id: categoryId,
          userId: userId,
        },
        data: {
          name
        },
      })

      res.json({
        success: true,
        title: 'Updated Category',
        category,
      })
    } catch (err) {
      // If category id or user id doesn't match it throws error with code P2025
      if (err.code === 'P2025') {
        const invalidCategory = new RecordNotFoundError(
          'The category you want to update no longer exists.'
        )
        return next(invalidCategory)
      }
      return next(err)
    }
  },
]

/* Delete category by id */
async function deleteCategory(req, res, next) {
  try {
    const userId = req.user.id
    const categoryId = Number(req.params.categoryId)
    const isInt = Number.isInteger(categoryId)
    const isAdmin = req.user.role === 'ADMIN'

    // Make sure categoryId is a number
    if (!isInt) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Fetch category by id
    const category = await prisma.category.findUnique({
      where: { id: categoryId },
    })

    // Category is not found
    if (!category) {
      const invalidCategory = new RecordNotFoundError(
        'The category you want to delete no longer exists.'
      )
      return next(invalidCategory)
    }

    // Only author and admin can delete a category
    const isSelf = category.userId === userId
    if (!isAdmin && !isSelf) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to delete this category.'
      )
      return next(invalidUser)
    }

    // Delete category by id
    const deletedCategory = await prisma.category.delete({
      where: { id: categoryId },
    })

    return res.json({
      success: true,
      msg: 'Category successfully deleted',
      deletedCategory,
    })
  } catch (err) {
    return next(err)
  }
}

export {
  getNewCategoryForm,
  createNewCategory,
  getAllCategories,
  getEditCategoryForm,
  updateCategory,
  deleteCategory,
}
