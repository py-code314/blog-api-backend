/* Throw custom error if post is not found */
class RecordNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 404
    this.name = 'RecordNotFoundError'
    this.title = 'Record Not Found'
  }
}

export default RecordNotFoundError
