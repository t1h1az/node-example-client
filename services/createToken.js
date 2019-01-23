const jwt = require('jsonwebtoken');
const { secret } = require('../configs/auth');

const tokenForUser = (userRequestingLogin) => {
  const timeStamp = new Date().getTime();
  // sub and iat are added by convention, they are the tokens payload and can be used eg in passports jwtStrategy
  const token = jwt.sign({ email: userRequestingLogin.email, iat: timeStamp  }, secret, {
        expiresIn: 86400 // 24 hours
      });
  return token;
}

module.exports = tokenForUser;
