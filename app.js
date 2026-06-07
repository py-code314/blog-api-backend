import 'dotenv/config'
import express from 'express'

/**
 * -------------- GENERAL SETUP ----------------
 */

const app = express()

// Express middleware 
app.use(express.json()) // To read JSON data from client
app.use(express.urlencoded({ extended: true })) // To parse URL encoded form data

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

// console.log('Hello ever running Node.js project.')
// console.log(process.env.MY_SECRET)
