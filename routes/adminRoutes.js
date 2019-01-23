const { modelController } = require('../controllers/adminControllers') 

module.exports = (app) => {

  app.get('/api/admin/generate_mock_boxes', (req, res) => {
    console.log('inc')
    modelController.generateMockBoxes(req, res) 
  }) 

  app.get('/api/admin/fetch_user', (req, res) => {
    modelController.fetchUser(req, res)
  }) 

  app.get('/api/admin/generate_mock_cards', (req, res) => {
    modelController.generateMockCards(req, res) 
  }) 

  app.post('/api/filter_boxes', (req, res) => {
    boxControllers.fetchBoxesByCategory(req, res) 
  })

  app.post('/api/search_boxes', (req, res) => {
    boxControllers.fetchBoxByName(req, res)
  })

  app.post('/api/fetch_public_boxes', (req, res) => {
    boxControllers.fetchAllPublicBoxes(req, res)
  }) 

  app.put('/api/update_box', (req, res) => {
    boxControllers.updateBox(req, res) 
  }) 

  app.delete('/api/delete_box', (req, res) => {
    boxControllers.deleteBox(req, res) 
  }) 
} 
