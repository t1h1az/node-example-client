const { signInController } = require('./signInController')
const { signUpController } = require('./signUpController')
const { logoutController } = require('./logoutController')

const authControllers = {
  signInController: signInController,
  signUpController: signUpController,
  logoutController: logoutController,
}

module.exports = authControllers
