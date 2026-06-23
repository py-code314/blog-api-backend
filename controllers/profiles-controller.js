import { body, validationResult, matchedData } from 'express-validator'
import { prisma } from '../lib/prisma.js'
import BadRequestError from '../errors/request-error.js'
import RecordNotFoundError from '../errors/resource-error.js'
import AuthorizationError from '../errors/authorization-error.js'

/* Error messages */
const emptyErr = 'can not be empty.'

/* Validate new profile */
const validateProfile = [
  body('bio')
    .trim()
    .optional({ values: 'falsy' })
    .notEmpty()
    .withMessage(`Profile content ${emptyErr}`),
]

/* Show profile form */
async function getNewProfileForm(req, res) {
  res.json({
    success: true,
    title: 'New Profile',
    msg: 'Get new profile form',
  })
}

/* Validate and create new profile */
const createNewProfile = [
  validateProfile,

  async (req, res, next) => {
    // Get form data
    const { bio } = req.body

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        title: 'New Profile',
        profile: {bio},
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { bio } = matchedData(req)
      const userId = req.user.id

      // Add profile to db
      const profile = await prisma.profile.create({
        data: {
          bio,
          user: {
            connect: { id: userId },
          },
        },
      })
      return res.json({
        success: true,
        profile,
      })
    } catch (err) {
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

/* Get a profile by id */
async function getProfileById(req, res, next) {
  try {
    const profileId = parseInt(req.params.profileId, 10)
    // const userId = req.user.id

    // Make sure profileId is a number
    if (isNaN(profileId)) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Get profile by id
    const profile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    })

    // Throw error if profile is not found
    if (!profile) {
      const invalidProfile = new RecordNotFoundError(
        'The profile you are looking for no longer exists.'
      )
      return next(invalidProfile)
    }

    res.json({
      success: true,
      profile,
    })
  } catch (err) {
    return next(err)
  }
}

/* Show profile form for editing */
async function getEditProfileForm(req, res, next) {
  try {
    const userId = req.user.id
    /* Use Number instead of parseInt because parseInt
    allows invalid ids like '1hello',it just ignores the text 
    in the id variable */
    const profileId = Number(req.params.profileId)
    const isInt = Number.isInteger(profileId)

    // Make sure profileId is a number
    if (!isInt) {
      const badRequest = new BadRequestError(
        'The web address looks invalid. Please check the URL and try again.'
      )
      return next(badRequest)
    }

    // Get profile by id
    const profile = await prisma.profile.findUnique({
      where: {
        id: profileId,
      },
    })

    // Profile is not found
    if (!profile) {
      const invalidProfile = new RecordNotFoundError(
        'The profile you want to edit no longer exists.'
      )
      return next(invalidProfile)
    }

    // Only owner can edit profile
    if (profile.userId !== userId) {
      const invalidUser = new AuthorizationError(
        'You do not have permission to edit this profile.'
      )
      return next(invalidUser)
    }

    res.json({
      success: true,
      title: 'Edit Profile',
      profile,
    })
  } catch (err) {
    return next(err)
  }
}

export {
  getNewProfileForm,
  createNewProfile,
  getProfileById,
  getEditProfileForm,
}
