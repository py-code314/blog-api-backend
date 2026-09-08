import { prisma } from '../lib/prisma.js'

// Get all author unpublished posts
async function getAllStats(req, res, next) {
  try {
    const userId = req.user?.id

    const postsTotal = await prisma.post.count({
      where: {
        authorId: userId,
      },
    })
    const publishedTotal = await prisma.post.count({
      where: {
        authorId: userId,
        published: true
      },
    })
    const draftsTotal = await prisma.post.count({
      where: {
        authorId: userId,
        published: false
      },
    })
    const categoriesTotal = await prisma.category.count({
      where: {
        userId,
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
