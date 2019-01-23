const { secret } = require('../configs/auth')
const jwt = require('jsonwebtoken')

exports.verifyToken = (token) => {
  if (!token) {
    return res.status(401).send({ auth: false, message: 'you have provided no token.' })
  }
  return jwt.verify(token, secret, function(err, decoded) {
    if (err) {
      return res.status(500).send({ auth: false, message: 'server error' })
    }
    return decoded
  })
}
