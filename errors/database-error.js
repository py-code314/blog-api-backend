/* Throw custom error if connecting to db fails */
class databaseConnectionError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 503
    this.name = 'databaseConnectionError'
    this.title = 'Database Connection Error'
  }
}

export default databaseConnectionError
