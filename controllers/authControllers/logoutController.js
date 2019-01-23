const User = require('../../models/User');

exports.logoutController = (res) => {
  res.status(200).send({ authenticated: false });
};
