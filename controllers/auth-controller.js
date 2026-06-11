import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { body, validationResult, matchedData } from 'express-validator'
import databaseConnectionError from '../errors/database-error.js'

/* Error messages */
const emptyErr = 'can not be empty.'
const existsErr = 'already in use.'
const lengthErr = 'must be at least 8 characters long.'
const emailInvalidErr = 'is invalid.'
const passwordInvalidErr =
  'must contain an uppercase letter, a number, and a special character.'
const alphaErr = 'must contain only letters.'

/* Validate sign up form data */
const validateUser = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage(`Email ${emptyErr}`)
    .bail()
    .isEmail()
    .withMessage(`Email ${emailInvalidErr}`)
    .custom(async (email) => {
      // Throw error if email already exists in db
      const existingUser = await prisma.user.findUnique({
        where: {
          email,
        },
      })
      if (existingUser) {
        throw new Error(`Email is ${existsErr}`)
      }

      // Express custom validators must return a truthy value to
      // indicate that the field is valid, or falsy to indicate it's invalid
      return true
    }),
  body('name')
    .trim()
    .optional({ values: 'falsy' })
    .notEmpty()
    .withMessage(`Name ${emptyErr}`)
    .bail()
    .isAlpha('en-US', { ignore: ' -' })
    .withMessage(`First Name ${alphaErr}`),
  body('password')
    .trim()
    .notEmpty()
    .withMessage(`Password ${emptyErr}`)
    .bail()
    .isLength({ min: 8 })
    .withMessage(`Password ${lengthErr}`)
    .bail()
    // Password must contain at least 8 characters with
    // an uppercase letter, a number, and a special character
    .matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/)
    .withMessage(`Password ${passwordInvalidErr}`),
  body('confirmPassword')
    .trim()
    .notEmpty()
    .withMessage(`Confirm Password ${emptyErr}`)
    .bail()
    .custom((password, { req }) => {
      return password === req.body.password
    })
    .withMessage('Passwords do not match.'),
]

/* Show sign up form */
async function sign_up_get(req, res) {
  res.json({
    title: 'Sign-up',
  })
}

/* Validate and add new user */
const sign_up_post = [
  validateUser,

  async (req, res, next) => {
    // Get form data except password
    const { email, name } = req.body
    const signupData = {
      email,
      name,
    }

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        title: 'Sign-up',
        user: signupData,
        errors: errors.array(),
      })
    }

    try {
      // Get validated form data
      const { email, name, password } = matchedData(req)
      const hashedPassword = await bcrypt.hash(password, 10)

      // Add new user to db
      await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: hashedPassword,
        },
      })

      res.json({
        message: 'User successfully added',
      })
    } catch (err) {
      // console.error(err)
      if (err.code === 'ECONNREFUSED') {
        const dbError = new databaseConnectionError(
          'Failed to connect to the database. Please try again later.'
        )
        // Pass the error to next() for older Express versions instead
        // of just throwing the error
        return next(dbError)
      }
      return next(err)
    }
  },
]

export { sign_up_get, sign_up_post }
