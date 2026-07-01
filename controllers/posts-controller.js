import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import RecordNotFoundError from '../errors/resource-error.js'
import BadRequestError from '../errors/request-error.js'
import AuthorizationError from '../errors/authorization-error.js'
import verifyCategoryIds from '../utils/categories.js'

/* Error messages */
const emptyErr = 'can not be empty.'
const booleanErr = 'must be true or false.'
const arrErr = 'must be an array of IDs.'
const intErr = 'must be an integer.'

/* Validate new post */
const validatePost = [
  body('title').trim().notEmpty().withMessage(`Title ${emptyErr}`),
  body('content').trim().notEmpty().withMessage(`Post content ${emptyErr}`),
  body('published')
    .optional({ values: 'null' })
    .trim()
    .isBoolean()
    .withMessage(`published ${booleanErr}`)
    .toBoolean(),
  body('categories')
    .optional({ values: 'falsy' })
    .isArray()
    .withMessage(`Categories ${arrErr}`),
  body('categories.*')
    .isInt()
    .withMessage(`Each category ID ${intErr}`)
    .toInt(),
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
    const { title, content, published, categories } = req.body
    const postData = {
      title,
      content,
      published,
      categories,
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
      const { title, content, published, categories } = matchedData(req)

      const userId = req.user.id

      let postData = {
        title,
        content,
        author: {
          connect: { id: userId },
        },
      }

      // Add published to postData conditionally
      if (published !== undefined) {
        postData.published = published
      }

      // Add categories to postData conditionally
      const validCategories = await verifyCategoryIds(categories)

      if (validCategories) {
        postData.categories = {
          connect: categories.map((categoryId) => ({ id: categoryId })),
        }
      }

      // Add post to db
      const post = await prisma.post.create({
        data: postData,
      })

      return res.json({
        success: true,
        post,
      })
    } catch (err) {
      // Prisma throws error with code P2025 if userId is invalid in the query
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

// Get all published posts
async function getPublicPosts(req, res, next) {
  try {
    const posts = await prisma.post.findMany({
      where: {
        published: true,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return res.json({
      success: true,
      posts,
    })
  } catch (err) {
    return next(err)
  }
}

// Get all author posts both published & unpublished
async function getAuthorPosts(req, res, next) {
  try {
    const userId = req.user?.id

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      orderBy: {
        updatedAt: 'desc',
      },
    })

    return res.json({
      success: true,
      posts,
    })
  } catch (err) {
    return next(err)
  }
}

/* Get a public post by id */
async function getPublicPostById(req, res, next) {
  try {
    const postId = Number(req.params.postId)
    const isInt = Number.isInteger(postId)

    // Make sure postId is a number
    if (!isInt) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Get post by id
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        published: true
      },
      include: { categories: true },
    })

    // Throw error if post is not found
    if (!post) {
      const invalidPost = new RecordNotFoundError(
        'The post you are looking for no longer exists.'
      )
      return next(invalidPost)
    }

    return res.json({
      success: true,
      post,
    })
  } catch (err) {
    return next(err)
  }
}
// /* Get a specific post by id */
// async function getPostById(req, res, next) {
//   try {
//     const postId = Number(req.params.postId)
//     const isInt = Number.isInteger(postId)

//     // Make sure postId is a number
//     if (!isInt) {
//       const badRequest = new BadRequestError(
//         'The web address looks invalid. Please check the URL and try again.'
//       )
//       return next(badRequest)
//     }

//     // TODO: Visitor/user can see only published posts
//     // TODO: Author can see published & unpublished posts
//     // * For visitor post id and published true both should match
//     // * For user only post id should match
//     // Get post by id
//     const post = await prisma.post.findUnique({
//       where: {
//         id: postId,
//       },
//       include: { categories: true },
//     })

//     // Throw error if post is not found
//     if (!post) {
//       const invalidPost = new RecordNotFoundError(
//         'The post you are looking for no longer exists.'
//       )
//       return next(invalidPost)
//     }

//     return res.json({
//       success: true,
//       post,
//     })
//   } catch (err) {
//     return next(err)
//   }
// }

/* Show blog post form for editing */
async function getEditPostForm(req, res, next) {
  try {
    const userId = req.user.id
    const postId = Number(req.params.postId)
    const isInt = Number.isInteger(postId)

    // Make sure postId is a number
    if (!isInt) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Get post by id
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
    })

    // Post is not found
    if (!post) {
      const invalidPost = new RecordNotFoundError(
        'The post you want to edit no longer exists.'
      )
      return next(invalidPost)
    }

    // User isn't the author
    if (post.authorId !== userId) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to edit this post.'
      )
      return next(invalidUser)
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
      const postId = Number(req.params.postId)
      const isInt = Number.isInteger(postId)

      // Make sure postId is a number
      if (!isInt) {
        const badRequest = new BadRequestError(
          'The web address looks invalid. Please check the URL and try again.'
        )
        return next(badRequest)
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
        const invalidPost = new RecordNotFoundError(
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
    const postId = Number(req.params.postId)
    const isInt = Number.isInteger(postId)
    const isAdmin = req.user.role === 'ADMIN'

    // Make sure postId is a number
    if (!isInt) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Fetch post by id
    const post = await prisma.post.findUnique({
      where: { id: postId },
    })

    // Post is not found
    if (!post) {
      const invalidPost = new RecordNotFoundError(
        'The post you want to delete no longer exists.'
      )
      return next(invalidPost)
    }

    // Only author and admin can delete a post
    const isAuthor = post.authorId === userId
    if (!isAdmin && !isAuthor) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to delete this post.'
      )
      return next(invalidUser)
    }

    // Delete post by id
    const deletedPost = await prisma.post.delete({
      where: { id: postId },
    })

    return res.json({
      success: true,
      msg: 'Post successfully deleted',
      deletedPost,
    })
  } catch (err) {
    return next(err)
  }
}

export {
  getNewPostForm,
  createNewPost,
  getPublicPosts,
  getAuthorPosts,
  getPublicPostById,

  // getPostById,
  getEditPostForm,
  updatePost,
  deletePost,
}
