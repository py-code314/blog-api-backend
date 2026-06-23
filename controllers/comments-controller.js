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
      // ? Catch PrismaClientValidationError if any id is missing in the query
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

/* Validate and update a comment */
const updateComment = [
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
        title: 'Edit Comment',
        comment: { content },
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { content } = matchedData(req)
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

      // Get comment by comment id and user id to make sure only author can edit it
      const comment = await prisma.comment.update({
        where: {
          id: commentId,
          authorId: userId,
        },
        data: {
          content,
        },
      })

      res.json({
        success: true,
        title: 'Updated Comment',
        comment,
      })
    } catch (err) {
      // If comment id or user id doesn't match it throws error with code P2025
      if (err.code === 'P2025') {
        const invalidComment = new RecordNotFoundError(
          'The comment you want to update no longer exists.'
        )
        return next(invalidComment)
      }
      return next(err)
    }
  },
]

/* Delete comment by id */
async function deleteComment(req, res, next) {
  try {
    const userId = req.user.id
    const postId = parseInt(req.params.postId, 10)
    const commentId = parseInt(req.params.commentId, 10)
    const isAdmin = req.user.role === 'ADMIN'

    // Make sure postId and commentId are numbers
    if (isNaN(postId) || isNaN(commentId)) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Fetch comment by id
    const comment = await prisma.comment.findUnique({
      where: { id: commentId },
    })

    // Comment not found
    if (!comment) {
      const invalidComment = new RecordNotFoundError(
        'The comment you want to delete no longer exists.'
      )
      return next(invalidComment)
    }

    // Only author and admin can delete a comment
    const isAuthor = comment.authorId === userId
    if (!isAdmin && !isAuthor) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to delete this comment.'
      )
      return next(invalidUser)
    }

    // Delete comment by id
    const deletedComment = await prisma.comment.delete({
      where: { id: commentId },
    })

    return res.json({
      success: true,
      msg: 'Comment successfully deleted',
      deletedComment,
    })
  } catch (err) {
    return next(err)
  }
}

export {
  getNewCommentForm,
  createNewComment,
  getEditCommentForm,
  updateComment,
  deleteComment,
}
