import { prisma } from '../lib/prisma.js'
import RecordNotFoundError from '../errors/resource-error.js'

/* Check for valid ids */
async function verifyTagIds(tags) {
  if (!tags || tags.length === 0) return

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
    throw new RecordNotFoundError('One or more tags do not exist.')
  } else {
    return true
  }
}

export default verifyTagIds
