import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import BadRequestError from '../errors/request-error.js'
import UserNotFoundError from '../errors/user-error.js'

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
      // ? What kind of error to generate
      if (err.code === 'P2025') {
        const badRequest = new BadRequestError(
          'The web address looks invalid. Please check the URL and try again.'
        )
        return next(badRequest)
      }
      return next(err)
    }
  },
]

/* Get all categories by user id */
async function getAllCategories(req, res, next) {
  try {
    const userId = req.user.id

    // Check for user
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    })

    // Throw error if user doesn't exist
    if (!userExists) {
      const invalidUser = new UserNotFoundError(
        'User not found. Please log in and try again.'
      )
      return next(invalidUser)
    }

    // Get all categories
    const categories = await prisma.category.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return res.json({
      success: true,
      categories,
    })
  } catch (err) {
    return next(err)
  }
}

export { getNewCategoryForm, createNewCategory, getAllCategories }
