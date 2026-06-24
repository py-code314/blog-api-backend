/* Throw custom error if user not found */
class UserNotFoundError extends Error {
  constructor(message) {
    super(message)
    this.statusCode = 404
    this.name = 'UserNotFoundError'
    this.title = 'User Not Found'
  }
}

export default UserNotFoundError
