import passport from 'passport'
import { Strategy as LocalStrategy } from 'passport-local'
import bcrypt from 'bcryptjs'
import { prisma } from '../lib/prisma.js'

/* Verify email and password before logging in */
const verifyCallback = async (email, password, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { email } })
    // console.log("🚀 ~ verifyCallback ~ user:", user)

    // User doesn't exist
    if (!user) {
      return done(null, false, { message: 'Incorrect Email' })
    }

    // Passwords don't match
    const match = await bcrypt.compare(password, user.passwordHash)
    if (!match) {
      return done(null, false, { message: 'Incorrect Password' })
    }

    // Email and password match
    return done(null, user)
  } catch (err) {
    return done(err)
  }
}

// Assign usernameField to email
const strategy = new LocalStrategy({ usernameField: 'email' }, verifyCallback)

passport.use(strategy)
