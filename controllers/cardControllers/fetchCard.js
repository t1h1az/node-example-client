const Card = require('../../models/Card')
const User = require('../../models/User')
const ObjectId = require('mongoose').Types.ObjectId
const { verifyToken } = require('../../services/verifyToken');

exports.fetchCards = (req, res) => {
  const token = req.headers.token
  const boxId = req.headers.id
  const { email } = verifyToken(token)

  User.findOne({email})
  .then((user) => {
    Card.find({__box: boxId})
      .then((cards) => {
        res.status(200).send(cards)
      })
      .catch((error) => {
        res.status(400).send('user not found - fetchAllFlashcards')
      })
  })
  .catch((err) => {
    res.status(401).send(err)
  })
}

exports.fetchCard = (req, res) => {
  const cardId = req.body.id
  const token = req.headers.token
  const { email } = verifyToken(token)

  User.findOne({email})
    // .populate('cards')
    .exec(async (error, user) => {
      if(error) {
        res.status(401).send('error pitch - readFlashcard' + error)
      } 
      if (user.cards === null) {
        res.status(200).status({message: "user has no cards yet"})
      }
      const foundCard = await (user.cards).find((elementId) => {
        return (elementId == cardId)
      })
      
      Card.findOne({_id: new ObjectId(foundCard)})
        .exec((error, card) => {
          if (error) {
            res.status(400).send({error, message: "error while querying db for card "})
          }
          res.status(200).send({success: "single card fetched", payload: card})
        })
  })
}
