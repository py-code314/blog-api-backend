import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import BadRequestError from '../errors/request-error.js'

/* Error messages */
const emptyErr = 'can not be empty.'
const alphanumericErr = 'can only contain letters, numbers, spaces, and characters -(hyphen), &(ampersand).'

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
        category: {name},
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

export { getNewCategoryForm, createNewCategory }
