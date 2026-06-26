import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import AuthorizationError from '../errors/authorization-error.js'
import BadRequestError from '../errors/request-error.js'
import RecordNotFoundError from '../errors/resource-error.js'

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

/* Get all tags by user id */
async function getAllTags(req, res, next) {
  try {
    const userId = req.user.id

    // Check for user
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
    })

    // Throw error if user doesn't exist
    if (!userExists) {
      const invalidUser = new AuthorizationError(
        'User not found. Please log in and try again.'
      )
      return next(invalidUser)
    }

    // Get all tags
    const tags = await prisma.tag.findMany({
      where: {
        userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return res.json({
      success: true,
      tags,
    })
  } catch (err) {
    return next(err)
  }
}

/* Get tag data for editing */
async function getEditTagForm(req, res, next) {
  try {
    const userId = req.user.id
    const tagId = Number(req.params.tagId)
    const isInt = Number.isInteger(tagId)

    // Make sure tagId is a number
    if (!isInt) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Get tag by id
    const tag = await prisma.tag.findUnique({
      where: {
        id: tagId,
      },
    })

    // Tag is not found
    if (!tag) {
      const invalidTag = new RecordNotFoundError(
        'The tag you want to edit no longer exists.'
      )
      return next(invalidTag)
    }

    // User not created the tag
    if (tag.userId !== userId) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to edit this tag.'
      )
      return next(invalidUser)
    }

    res.json({
      success: true,
      title: 'Edit Tag',
      tag,
    })
  } catch (err) {
    return next(err)
  }
}

export { getNewTagForm, createNewTag, getAllTags, getEditTagForm }
