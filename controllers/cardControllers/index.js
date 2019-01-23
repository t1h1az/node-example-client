const { deleteCard } = require('./deleteCard')
const { createCard } = require('./createCard')
const { fetchCard, fetchCards } = require('./fetchCard')
const { updateCard, updateCardProgress } = require( './updateCard')
const { resetCardNumbers } = require('./cardNumberController')


const cardControllers = {
  deleteCard,
  createCard,
  fetchCards,
  fetchCard,
  resetCardNumbers,
  updateCard,
  updateCardProgress
}

module.exports = cardControllers
