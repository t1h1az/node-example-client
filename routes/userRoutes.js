const authController = require('../controllers/authControllers');

module.exports = (app) => {
  require('./cardRoutes')(app);
  require('./boxRoutes')(app);

  app.post('/signin', (req, res) => {
    authController.signInController(req, res);
  })

  app.post('/signup', (req, res) => {
    authController.signUpController(req, res);
  })

  app.get('/user/logout', (req, res) => {
    authController.logoutController (req, res);
  })

  app.get('/user/account', (res) => {
    return res.send('get account details')
  })

  app.post('/user/retrieve_password', (req, res) => {
    authController.retrievePasswordController (req, res)
  })
}
