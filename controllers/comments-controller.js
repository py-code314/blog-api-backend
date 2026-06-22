import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import RecordNotFoundError from '../errors/resource-error.js'
import AuthorizationError from '../errors/authorization-error.js'
import BadRequestError from '../errors/request-error.js'

/* Error messages */
const emptyErr = 'can not be empty.'

/* Validate new comment */
const validateComment = [
  body('content').trim().notEmpty().withMessage(`Comment content ${emptyErr}`),
]

/* Show new comment form */
async function getNewCommentForm(req, res) {
  res.json({
    success: true,
    msg: 'Get new comment form',
  })
}

/* Validate and create a new comment */
const createNewComment = [
  validateComment,

  async (req, res, next) => {
    // Get form data
    const { content } = req.body

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        title: 'New Comment',
        content,
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { content } = matchedData(req)
      const userId = req.user.id
      const postId = parseInt(req.params.postId, 10)

      // Add comment to db
      const comment = await prisma.comment.create({
        data: {
          content,
          author: {
            connect: { id: userId },
          },
          post: {
            connect: { id: postId },
          },
        },
      })
      return res.json({
        success: true,
        comment,
      })
    } catch (err) {
      return next(err)
    }
  },
]

/* Show blog post form for editing */
async function getEditCommentForm(req, res, next) {
  try {
    const userId = req.user.id
    const postId = parseInt(req.params.postId, 10)
    const commentId = parseInt(req.params.commentId, 10)

    // Make sure postId and commentId are numbers
    if (isNaN(postId) || isNaN(commentId)) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Fetch comment by id
    const comment = await prisma.comment.findUnique({
      where: {
        id: commentId,
      },
    })

    // Comment is not found
    if (!comment) {
      const invalidComment = new RecordNotFoundError(
        'The comment you want to edit no longer exists.'
      )
      return next(invalidComment)
    }

    // Comment doesn't belong to the specific post
    if (comment.postId !== postId) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // User isn't the author
    if (comment.authorId !== userId) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to edit this comment.'
      )
      return next(invalidUser)
    }

    res.json({
      success: true,
      title: 'Edit Comment',
      comment,
    })
  } catch (err) {
    return next(err)
  }
}

export { getNewCommentForm, createNewComment, getEditCommentForm }
