import { Router } from 'express'

const postsRouter = Router()

// New post routes
postsRouter.get('/new', (req, res) => {
  res.send('Get form to add a new blog post')
})

export { postsRouter }
