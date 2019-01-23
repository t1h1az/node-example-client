const AWS = require('aws-sdk')
const uuid = require('uuid/v1')
const keys = require('../configs/aws.keys.js')
const jwt = require('jsonwebtoken')
const requireLogin = require('../middlewares/requireLogin')
const { secret } = require('../configs/auth')
const User = require('../models/User')

module.exports = (app) => {
  app.post('/api/upload_whitepapers', (req, res) => {
    const token = req.headers.token
    if (!token) return res.status(401).send({ auth: false, message: 'No token provided.' })
    jwt.verify(token, secret, function(err, decoded) {
      
      const key = `${decoded.email}/${uuid()}.jpeg`
     
      s3.getSignedUrl(
        'putObject', { 
          Bucket: 'kotei-whitepapers',
          ContentType: 'image/jpeg',
          Key: key
        }, 
        (err, url) => {
          res.send({ key, url})
        }
      )
    })
  })
}
