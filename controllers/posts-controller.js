import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import PostNotFoundError from '../errors/post-error.js'

/* Error messages */
const emptyErr = 'can not be empty.'

/* Validate new post */
const validatePost = [
  body('title').trim().notEmpty().withMessage(`Title ${emptyErr}`),
  body('content').trim().notEmpty().withMessage(`Post content ${emptyErr}`),
]

/* Show blog post form */
async function getNewPostForm(req, res) {
  res.json({
    success: true,
    title: 'New Post',
    msg: 'Get new blog post form',
  })
}

/* Validate and create new blog post */
const createNewPost = [
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
      const post = await prisma.post.create({
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
        post,
      })
    } catch (err) {
      return next(err)
    }
  },
]

async function getPostById(req, res, next) {
  try {
    const postId = parseInt(req.params.postId, 10)

    // Make sure postId is a number
    if (isNaN(postId)) {
      const invalidPost = new PostNotFoundError(
        "That doesn't look like a valid post link. Make sure you have the correct web address."
      )
      return next(invalidPost)
    }

    // Get post by id
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    // ? Should I throw error for update and delete too
    // Throw error if post is not found
    if (!post) {
      const invalidPost = new PostNotFoundError(
        'The post you are looking for no longer exists.'
      )
      return next(invalidPost)
    }

    res.json({
      success: true,
      post,
    })
  } catch (err) {
    return next(err)
  }
}

export { getNewPostForm, createNewPost, getPostById }
