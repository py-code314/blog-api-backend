/* Throw custom error if post is not found */
class PostNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 404
    this.name = 'PostNotFoundError'
    this.title = 'Post Not Found'
  }
}

export default PostNotFoundError

// TODO: Can safely delete this error class