const boxControllers = require('../controllers/boxControllers') 

module.exports = (app) => {

  app.post('/api/create_box', (req, res) => {
    boxControllers.createBox(req, res) 
  }) 

  app.get('/api/fetch_box', (req, res) => {
    boxControllers.fetchBox(req, res) 
  }) 

  app.post('/api/fetch_boxes', (req, res) => {
    boxControllers.fetchAllBoxes(req, res) 
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
