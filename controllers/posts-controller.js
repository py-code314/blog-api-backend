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

/* Get a specific post by id */
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
 // TODO: Change findUnique to findFirst
/* Show blog post form for editing */
async function getEditPostForm(req, res, next) {
  try {
    const userId = req.user.id
    const postId = parseInt(req.params.postId, 10)

    // Make sure postId is a number
    if (isNaN(postId)) {
      const invalidPost = new PostNotFoundError(
        "That doesn't look like a valid post link. Make sure you have the correct web address."
      )
      return next(invalidPost)
    }
   
    // Get post by post id and user id to make sure only author can edit it
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
    })

    // Throw error if post is not found
    if (!post) {
      const invalidPost = new PostNotFoundError(
        'The post you are looking for no longer exists.'
      )
      return next(invalidPost)
    }

    res.json({
      success: true,
      title: 'Edit Post',
      post,
    })
  } catch (err) {
    return next(err)
  }
}

/* Validate and update a blog post */
const updatePost = [
  validatePost,

  async (req, res, next) => {
    // console.log('update post running')
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
        title: 'Edit Post',
        postData,
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { title, content } = matchedData(req)
      const userId = req.user.id
      const postId = parseInt(req.params.postId, 10)

      // Make sure postId is a number
      if (isNaN(postId)) {
        const invalidPost = new PostNotFoundError(
          "That doesn't look like a valid post link. Make sure you have the correct web address."
        )
        return next(invalidPost)
      }

      // Get post by post id and user id to make sure only author can edit it
      const post = await prisma.post.update({
        where: {
          id: postId,
          authorId: userId,
        },
        data: {
          title,
          content,
        },
      })

      res.json({
        success: true,
        title: 'Updated Post',
        post,
      })
    } catch (err) {
      // If post id or user id doesn't match it throws error with code P2025
      if (err.code === 'P2025') {
        const invalidPost = new PostNotFoundError(
          'The post you want to update no longer exists.'
        )
        return next(invalidPost)
      }
      return next(err)
    }
  },
]

/* Delete post by id */
async function deletePost(req, res, next) {
  try {
    const userId = req.user.id
    const postId = parseInt(req.params.postId, 10)
    const isAdmin = req.user.role === 'ADMIN'

    // Make sure postId is a number
    if (isNaN(postId)) {
      const invalidPost = new PostNotFoundError(
        "That doesn't look like a valid post link. Make sure you have the correct web address."
      )
      return next(invalidPost)
    }

    // Check for admin status
    const data = isAdmin
      ? { id: postId }
      : {
          id: postId,
          authorId: userId,
        }

    // Author and admin both can delete a post
    const post = await prisma.post.delete({
      where: data,
    })

    return res.json({
      success: true,
      msg: 'Post successfully deleted',
      post,
    })
  } catch (err) {
    // If post id or user id doesn't match it throws error with code P2025
    if (err.code === 'P2025') {
      const invalidPost = new PostNotFoundError(
        'The post you want to delete no longer exists.'
      )
      return next(invalidPost)
    }
    return next(err)
  }
}

export {
  getNewPostForm,
  createNewPost,
  getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
}
