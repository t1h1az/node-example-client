const cardControllers = require('../controllers/cardControllers')

module.exports = (app) => {

  app.post('/api/create_card', (req, res) => {
    cardControllers.createCard(req, res)
  })

  app.get('/api/fetch_card', (req, res) => {
    cardControllers.fetchCard(req, res)
  })

  app.post('/api/fetch_cards', (req, res) => {
    cardControllers.fetchCards(req, res)
  })

  app.put('/api/update_card', (req, res) => {
    cardControllers.updateCard(req, res)
  })

  app.delete('/api/delete_card', (req, res) => {
    cardControllers.deleteCard(req, res)
  })

  app.put('/api/update_card_progress', (req, res) => {
    cardControllers.updateCardProgress(req, res)
  })

  app.put('/api/cards/reset_card_numbers', (req, res) => {
    cardControllers.resetCardNumbers(req, res)
  })
}
