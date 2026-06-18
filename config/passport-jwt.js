import 'dotenv/config'
import passport from 'passport'
import { Strategy as JwtStrategy } from 'passport-jwt'
import { ExtractJwt } from 'passport-jwt'
import { prisma } from '../lib/prisma.js'

// Options
let opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken()
opts.secretOrKey = process.env.JWT_SECRET

/* Verify JWT */
const verifyCallback = async (jwt_payload, done) => {
  try {
    // Check for user in db
    const user = await prisma.user.findUnique({
      where: { id: jwt_payload.sub },
    })

    if (user) return done(null, user)
    else return done(null, false)
  } catch (err) {
    // console.error(err)
    return done(err)
  }
}

const jwtStrategy = new JwtStrategy(opts, verifyCallback)

passport.use(jwtStrategy)
