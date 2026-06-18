/* Show custom error for absent or invalid JWT */
class AuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 401
    this.name = 'AuthenticationError'
    this.title = 'Authentication Error'
  }
}

export { AuthenticationError } 
