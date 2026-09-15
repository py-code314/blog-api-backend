import { prisma } from '../lib/prisma.js'

// Get all author unpublished posts
async function getAllStats(req, res, next) {
  try {
    const userId = req.user?.id

    /* Convert userId to number to prevent the query running when it's value is undefined. When userId is undefined query still runs and gets a count of all posts without any filtering applied. It throws error instead of silently returning a count when it is converted to a number */
    const postsTotal = await prisma.post.count({
      // Filter posts by authorId using where clause
      where: {
        authorId: Number(userId),
      },
    })
    const publishedTotal = await prisma.post.count({
      where: {
        authorId: userId,
        published: true,
      },
    })
    const draftsTotal = await prisma.post.count({
      where: {
        authorId: Number(userId),
        published: false,
      },
    })
    const categoriesTotal = await prisma.category.count({
      where: {
        userId: Number(userId),
      },
    })
    const tagsTotal = await prisma.tag.count({
      where: {
        userId,
      },
    })

    return res.json({
      success: true,
      postsTotal,
      publishedTotal,
      draftsTotal,
      categoriesTotal,
      tagsTotal,
    })
  } catch (err) {
    return next(err)
  }
}

export { getAllStats }
