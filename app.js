import 'dotenv/config'
import express from 'express'
import cors from 'cors'

import * as routes from './routes/index-routes.js'
import errorHandler from './middleware/error-handler.js'

/**
 * -------------- GENERAL SETUP ----------------
 */

const app = express()

// Express middleware
app.use(express.json()) // To read JSON data from client
app.use(express.urlencoded({ extended: true })) // To parse URL encoded form data
// TODO: Change cors set up later in production environment
app.use(cors()) // Allow CORS

/**
 * -------------- PASSPORT AUTHENTICATION ----------------
 */

import './config/passport-local.js' // Local strategy for initial log-in
import './config/passport-jwt.js' // JWT strategy for all subsequent log ins

/**
 * -------------- ROUTES ----------------
 */

app.use('/api/v1/signup', routes.signupRouter)
app.use('/api/v1/login', routes.loginRouter)
app.use('/api/v1/posts', routes.postsRouter)
app.use('/api/v1/posts/:postId/comments', routes.commentsRouter)
app.use('/api/v1/profiles', routes.profilesRouter)
app.use('/api/v1/categories', routes.categoriesRouter)

/**
 * -------------- ERROR HANDLER MIDDLEWARE ----------------
 */

app.use(errorHandler)

/**
 * -------------- SERVER ----------------
 */

// Port to listen on
const PORT = process.env.PORT || 3000
app.listen(PORT, (error) => {
  if (error) {
    throw error
  }
  console.log(`Blog API App - listening on port ${PORT}!`)
})
