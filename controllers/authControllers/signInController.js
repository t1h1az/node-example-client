const mongoose = require('mongoose');
const User = require('../../models/User');
const createToken = require('../../services/createToken');
const bcrypt = require('bcrypt-nodejs');

mongoose.Promise = global.Promise;

exports.signInController = (req, res) => {
  User.findOne({ email: req.body.email })
    .exec((error, user) => {
      if (error) {
        res.status(500).send({error: 'server_error'})
        return { error }

      };

      if (user === null) {
        res.status(400).send({ failure: 'user_not_found'});
        return { failure: 'user_not_found'};
      };

      const dataForToken = {
        id: user._id,
        email: user.email,
        password: user.password,
      };

      bcrypt.compare(req.body.password, user.password, (error, isMatch) => {
        if (error) {
          res.status(500).send({ error: 'server_error' })
          return { error }
        }
        if (isMatch) {
          res.status(200).send(createToken(dataForToken));
          return { success: "user_found" }
        }
        res.status(400).send({ error: "wrong_password" })
        return { failure: "wrong_password" }
      })
   })
}
