/* Express error handler middleware */
const errorHandler = (err, req, res, next) => {
  // console.error(err)

  /* Check if headers have already been sent to avoid "Can't set
   headers after they are sent" errors */
  if (res.headersSent) {
    return next(err) // Pass to default Express error handler if response already started
  }

  // Error data
  let statusCode = err.statusCode || 500
  let errorMessage = err.message || 'We encountered an unexpected problem. Please try again.' 
  let errorTitle = err.title || 'Internal Server Error'

  return res.status(statusCode).json({
    success: false,
    title: 'Error',
    errorCode: statusCode,
    errorTitle,
    errorMessage,
  })
}

export default errorHandler
