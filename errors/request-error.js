/* Throw custom error for invalid URL */
class BadRequestError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 400
    this.name = 'BadRequestError'
    this.title = 'Bad Request'
  }
}

export default BadRequestError
