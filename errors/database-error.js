/* Throw custom error if connecting to db fails */
class DatabaseConnectionError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 503
    this.name = 'DatabaseConnectionError'
    this.title = 'Database Connection Error'
  }
}

export default DatabaseConnectionError
