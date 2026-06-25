import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import AuthorizationError from '../errors/authorization-error.js'

/* Error messages */
const emptyErr = 'can not be empty.'
const alphanumericErr =
  'can only contain lowercase letters, numbers, and -(hyphen).'
const lowercaseErr = 'must be all lowercase letters.'

/* Validate tag */
const validateTag = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage(`Name ${emptyErr}`)
    .bail()
    .isAlphanumeric('en-US', { ignore: '-' })
    .withMessage(`Name ${alphanumericErr}`)
    .bail()
    .isLowercase()
    .withMessage(`Name ${lowercaseErr}`),
]

/* Show new tag form */
async function getNewTagForm(req, res) {
  res.json({
    success: true,
    title: 'New Tag',
    msg: 'Get new tag form',
  })
}

/* Validate and create new tag */
const createNewTag = [
  validateTag,

  async (req, res, next) => {
    // Get form data
    const { name } = req.body

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        title: 'New Tag',
        tag: { name },
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { name } = matchedData(req)
      const userId = req.user.id
      // TODO: Add post id when a tag is added to a post
      // Add tag to db
      const tag = await prisma.tag.create({
        data: {
          name,
          user: {
            connect: { id: userId },
          },
        },
      })
      return res.json({
        success: true,
        tag,
      })
    } catch (err) {
      // User id doesn't match in query
      if (err.code === 'P2025') {
        const invalidUser = new AuthorizationError(
          'You do not have permission to create a new tag. Please log in and try again.'
        )
        return next(invalidUser)
      }
      return next(err)
    }
  },
]

export { getNewTagForm, createNewTag }
