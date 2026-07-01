import { prisma } from '../lib/prisma.js'
import RecordNotFoundError from '../errors/resource-error.js'

/* Check for valid ids */
async function verifyCategoryIds(categories) {
  if (!categories || categories.length === 0) return

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
    throw new RecordNotFoundError('One or more categories do not exist.')
  } else {
    return true
  }

  
}

export default verifyCategoryIds
