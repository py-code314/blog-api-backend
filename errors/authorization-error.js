/* Show custom error for not having permissions */
class AuthorizationError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 403
    this.name = 'AuthorizationError'
    this.title = 'Authorization Error'
  }
}

export default  AuthorizationError 
