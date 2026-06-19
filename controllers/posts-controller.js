import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'

/* Error messages */
const emptyErr = 'can not be empty.'

/* Validate new post */
const validatePost = [
  body('title').trim().notEmpty().withMessage(`Title ${emptyErr}`),
  body('content').trim().notEmpty().withMessage(`Post content ${emptyErr}`),
]

/* Show blog post form */
async function post_get(req, res) {
  res.json({
    success: true,
    title: 'New Post',
    msg: 'Get new blog post form',
  })
}

/* Validate and create new blog post */
const post_post = [
  validatePost,

  async (req, res, next) => {
    // Get form data
    const { title, content } = req.body
    const postData = {
      title,
      content,
    }

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        title: 'New Post',
        postData,
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { title, content } = matchedData(req)
      const userId = req.user.id

      // Add post to db
      const result = await prisma.post.create({
        data: {
          title,
          content,
          author: {
            connect: { id: userId },
          },
        },
      })
      return res.json({
        success: true,
        result,
      })
    } catch (err) {
      return next(err)
    }
  },
]

export { post_get, post_post }
