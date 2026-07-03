/* Throw custom error if a duplicate is found */
class DuplicateError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 404
    this.name = 'DuplicateError'
    this.title = 'Duplicate Name Error'
  }
}

export default DuplicateError
