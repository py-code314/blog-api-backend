import jwt from 'jsonwebtoken'

async function verifyToken(req) {
  const bearerHeader = req.headers['authorization']
  const bearerToken = bearerHeader?.split(' ')[1]
  const userData = jwt.verify(
    bearerToken,
    process.env.JWT_SECRET,
    (err, authData) => {
      return authData
    }
  )
  return userData
}

export default verifyToken
