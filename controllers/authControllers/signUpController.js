const mongoose = require('mongoose')
const User = require('../../models/User')
const tokenForUser = require('../../services/createToken')

mongoose.Promise = global.Promise

exports.signUpController = function(req, res, next) {

  const password = req.body.password
  const email = req.body.email
  if (!password || !email){
    return res.status(417).send({error: "no_password_or_email"})
  }

  User.findOne({email: email}, (err, existingUser) => {
    if (err) {
      res.status(412).send({ error: "database_error"})
    } 
    if (existingUser) {
      res.status(423).send({error: 'email_exists'})
    } 
    
    const newUser = new User(req.body)
    newUser.save().then((user) => {
      res.json({token: tokenForUser(newUser), _id: user._id})
    })
  })
}
