import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'

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
      // console.log("🚀 ~ req:", req)
      // console.log("🚀 ~ req.params:", req.params)
      // console.log("🚀 ~ req.params.postId:", req.params.postId)
      console.log("🚀 ~ postId:", postId)

      // Add post to db
      const comment = await prisma.comment.create({
        data: {
          content,
          author: {
            connect: { id: userId },
          },
          post: {
            connect: {id: postId}
          }
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


export { getNewCommentForm, createNewComment }
