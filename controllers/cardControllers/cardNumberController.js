const Card = require('../../models/Card')
const { verifyToken } = require('../../services/verifyToken');
const ObjectId = require('mongoose').Types.ObjectId

const cardNumberController = {
  setCardNumbers(boxId) {
    Card.find()
    .where("__box").equals(boxId)
    .sort('createdAt')
    .then((returnedBoxes) => {
      let counter = 1
      returnedBoxes.forEach((box) => {
        box["cardNumber"] = counter
        counter++
        box.save()
      })
    })
  },
  resetCardNumbers(req, res ) {

    var {headers: {token, id}} = req
    verifyToken(token)

    Card.find({__box: ObjectId(id)})
      .then((cards) => {
        cards.forEach((card, index) => {
          card.cardNumber = ++index
          card.save()
        })
        res.status(200).send(cards)
        return
      })
      .catch((error) => {
        res.status(400).send({"error": error})
      })
  }
}

module.exports = cardNumberController;
