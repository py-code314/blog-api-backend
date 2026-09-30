import { prisma } from '../lib/prisma.js'

/* Get all authors */
async function getAllAuthors(req, res, next) {
  try {
    /* Filter users by published posts first, then select ids, and
    names from users */
    const authors = await prisma.user.findMany({
      where: {
        posts: {
          some: {
            published: true,
          },
        },
      },
      select: {
        id: true,
        name: true,
      },
    })

    return res.json({
      success: true,
      authors,
    })
  } catch (err) {
    return next(err)
  }
}

export { getAllAuthors }
