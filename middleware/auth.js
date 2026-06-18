import passport from 'passport'
import { AuthenticationError } from '../errors/authentication-error.js'

/* Check for valid user by verifying JWT */
const isAuth = async (req, res, next) => {
  passport.authenticate('jwt', { session: false }, async (err, user, info) => {
    // Database error
    if (err) {
      next(err)
    }
    // No JWT in the header
    if (info && info.message === 'No auth token') {
      const noTokenError = new AuthenticationError(
        'You must be logged in to perform this action. Please log in and try again.'
      )
      return next(noTokenError)
    } else if (info && info.message === 'invalid token') {
      // Invalid JWT
      const invalidTokenError = new AuthenticationError(
        'Your session has expired or is invalid. Please log in again to continue.'
      )
      return next(invalidTokenError)
    }
    // Manually add user to request
    req.user = user

    next()
  })(req, res, next)
}

export { isAuth }
