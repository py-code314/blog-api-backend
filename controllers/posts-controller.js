import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import RecordNotFoundError from '../errors/resource-error.js'
import BadRequestError from '../errors/request-error.js'
import AuthorizationError from '../errors/authorization-error.js'
import verifyCategoryIds from '../utils/categories.js'
import verifyTagIds from '../utils/tags.js'

/* Error messages */
const emptyErr = 'can not be empty.'
const arrErr = 'must be an array of IDs.'
const intErr = 'must be an integer.'

/* Validate new post */
const validatePost = [
  body('title').trim().notEmpty().withMessage(`Title ${emptyErr}`),
  body('content').trim().notEmpty().withMessage(`Post content ${emptyErr}`),
  body('published')
    .trim()
    .isBoolean()
    .withMessage(`You must choose either Yes or No.`)
    .toBoolean(),
  body('categories')
    .optional({ values: 'falsy' })
    .isArray()
    .withMessage(`Categories ${arrErr}`),
  body('categories.*')
    .isInt()
    .withMessage(`Each category ID ${intErr}`)
    .toInt(),
  body('categories').custom(async (categories) => {
    // Check for categories
    const count = await prisma.category.count({
      where: {
        id: {
          in: categories,
        },
      },
    })

    // Throw error if categories don't match
    if (count !== categories.length) {
      throw new Error('One or more categories do not exist.')
    }
    /* Express custom validators must return a truthy value to
     indicate that the field is valid, or falsy to indicate it's invalid */
    return true
  }),
  body('tags')
    .optional({ values: 'falsy' })
    .isArray()
    .withMessage(`Tags ${arrErr}`),
  body('tags.*').isInt().withMessage(`Each tag ID ${intErr}`).toInt(),
  body('tags').custom(async (tags) => {
    // Check for tags
    const count = await prisma.tag.count({
      where: {
        id: {
          in: tags,
        },
      },
    })

    // Throw error if tags don't match
    if (count !== tags.length) {
      throw new Error('One or more tags do not exist.')
    }
    /* Express custom validators must return a truthy value to indicate
     that the field is valid, or falsy to indicate it's invalid */
    return true
  }),
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
    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        validData: false,
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { title, content, published, categories, tags } = matchedData(req)
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

      // Add tags to postData conditionally
      const validTags = await verifyTagIds(tags)

      if (validTags) {
        postData.tags = {
          connect: tags.map((tagId) => ({ id: tagId })),
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
      console.error(err)
      // Prisma throws error with code P2025 if userId is invalid in the query
      if (err.code === 'P2025') {
        const badRequest = new BadRequestError()
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
      include: { categories: true, comments: true, tags: true },
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
      include: { categories: true, comments: true, tags: true },
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

// Get all author published posts 
async function getAuthorPublishedPosts(req, res, next) {
  try {
    const userId = req.user?.id

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
        published: true
      },
      include: { categories: true, comments: true, tags: true },
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

// Get 2 most recent posts
async function getRecentPosts(req, res, next) {
  try {
    const userId = req.user?.id

    const posts = await prisma.post.findMany({
      where: {
        authorId: userId,
      },
      include: { categories: true, comments: true, tags: true },
      orderBy: {
        updatedAt: 'desc',
      },
      take: 2,
    })
    console.log("🚀 ~ getRecentPosts ~ posts:", posts)

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
      const badRequest = new BadRequestError()
      return next(badRequest)
    }

    // Get post by id
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        published: true,
      },
      include: { categories: true, comments: true, tags: true },
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

/* Get an author post by id */
async function getAuthorPostById(req, res, next) {
  try {
    const postId = Number(req.params.postId)
    const isInt = Number.isInteger(postId)
    const userId = Number(req.user.id)

    // Make sure postId is a number
    if (!isInt) {
      const badRequest = new BadRequestError()
      return next(badRequest)
    }

    // Get own post by id
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
        authorId: userId,
      },
      include: { categories: true, comments: true, tags: true },
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

/* Show blog post form for editing */
async function getEditPostForm(req, res, next) {
  try {
    const userId = req.user.id
    const postId = Number(req.params.postId)
    const isInt = Number.isInteger(postId)

    // Make sure postId is a number
    if (!isInt) {
      const badRequest = new BadRequestError()
      return next(badRequest)
    }

    // Get post by id
    const post = await prisma.post.findUnique({
      where: {
        id: postId,
      },
      include: { categories: true, tags: true },
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
    // Validate request
    const errors = validationResult(req)

    // TODO: Add 'validData: false'
    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { title, content, published, categories, tags } = matchedData(req)

      const userId = req.user.id
      const postId = Number(req.params.postId)
      const isInt = Number.isInteger(postId)

      // Make sure postId is a number
      if (!isInt) {
        const badRequest = new BadRequestError()
        return next(badRequest)
      }

      let postData = {
        title,
        content,
      }

      // Add 'published' to postData conditionally
      if (published !== undefined) {
        postData.published = published
      }

      // Add categories to postData conditionally
      const validCategories = await verifyCategoryIds(categories)

      if (validCategories) {
        postData.categories = {
          set: [], // Clear existing categories
          connect: categories.map((categoryId) => ({ id: categoryId })),
        }
      }

      // Add tags to postData conditionally
      const validTags = await verifyTagIds(tags)

      if (validTags) {
        postData.tags = {
          connect: tags.map((tagId) => ({ id: tagId })),
        }
      }

      // Only author can update a post
      const post = await prisma.post.update({
        where: {
          id: postId,
          authorId: userId,
        },
        data: postData,
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
      const badRequest = new BadRequestError()
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
  getAuthorPublishedPosts,
  getRecentPosts,
  getPublicPostById,
  getAuthorPostById,
  getEditPostForm,
  updatePost,
  deletePost,
}
