import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'
import { body, validationResult, matchedData } from 'express-validator'
import DatabaseConnectionError from '../errors/database-error.js'
import passport from 'passport'
import jwt from 'jsonwebtoken'
import 'dotenv/config'

/* Error messages */
const emptyErr = 'can not be empty.'
const existsErr = 'already in use.'
const lengthErr = 'must be at least 8 characters long.'
const emailInvalidErr = 'is invalid.'
const passwordInvalidErr =
  'must contain an uppercase letter, a number, and a special character.'
const alphaErr = 'must contain only letters.'

/* Validate sign up form data */
const validateSignup = [
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

/* Validate log in data */
const validateLogin = [
  body('email').trim().notEmpty().withMessage(`Email ${emptyErr}`),
  body('password').trim().notEmpty().withMessage(`Password ${emptyErr}`),
]

/**
 * -------------- SIGN-UP ----------------
 */

/* Show sign up form */
async function getSignupForm(req, res) {
  res.json({
    title: 'Sign-up',
  })
}

/* Validate and add new user */
const registerUser = [
  validateSignup,

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

      const validSignupData = {
        email,
        name,
        passwordHash: hashedPassword,
      }

      // Change role to Admin if email matches
      if (email === process.env.ADMIN_EMAIL) {
        validSignupData.role = 'ADMIN'
      }

      // Add new user to db
      await prisma.user.create({
        data: validSignupData
      })

      res.json({
        message: 'User successfully added',
      })
    } catch (err) {
      // console.error(err)
      if (err.code === 'ECONNREFUSED') {
        const dbError = new DatabaseConnectionError(
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

/**
 * -------------- LOG-IN ----------------
 */

/* Show log in form */
async function getLoginForm(req, res) {
  // req.user = true
  // User is already logged in
  if (req.user) {
    return res.json({ title: 'Home' })
  }

  console.log(req.session.message)

  res.json({
    title: 'Log In',
  })
}

/* Validate and authenticate user */
const loginUser = [
  validateLogin,
  async (req, res, next) => {
    // Get email from form
    const { email } = req.body

    // Validate request
    const errors = validationResult(req)

    // Show errors if validation fails
    if (!errors.isEmpty()) {
      return res.status(400).json({
        title: 'Log-in',
        user: { email },
        errors: errors.array(),
      })
    }

    /* Call passport.authenticate() inside controller function instead
      of calling it in the route */
    // Make sure it's not using sessions
    /* CUSTOM CALLBACK
     - can be called with 3 arguments
     - sends error messages from Passport's verifyCallback() to the frontend
     - generates JWT and sends it to the client
    */
    /* Invoke the function returned by authenticate function immediately
     with req, res, next arguments */
    passport.authenticate(
      'local',
      { session: false },
      async (err, user, info) => {
        // console.log('🚀 ~ err, user, info:', err, user, info)
        if (err) {
          next(err)
        }

        // Email or password doesn't match
        if (!user) {
          return res.status(401).json({
            success: false,
            title: 'Login',
            user: { email },
            errorMsg: info.message,
          })
        }

        // Don't add any mutable data to payload and keep it lean
        const userData = {
          sub: user.id,
        }
        // Generate JWT asynchronous way
        jwt.sign(
          userData,
          process.env.JWT_SECRET,
          { expiresIn: '1d' },
          (err, token) => {
            // Handle error
            if (err) {
              return res.status(500).json({
                success: false,
                msg: 'Failed to generate authentication token. Please try again.',
              })
            }
            // JWT successfully generated
            // Filter user data for security
            const safeUserData = {
              id: user.id,
              email: user.email,
              name: user.name,
            }
            return res.json({
              success: true,
              title: 'Home',
              msg: 'Successfully logged in',
              user: safeUserData,
              token,
            })
          }
        )
      }
    )(req, res, next)
  },
]

export { getSignupForm, registerUser, getLoginForm, loginUser }
