const mongoose = require('mongoose')
const Turf = require('../../models/Turf')
const User = require('../../models/User')
const { secret } = require('../../configs/auth')
const jwt = require('jsonwebtoken')

mongoose.Promise = global.Promise

exports.createTurf = async (req, res) => {
  const token = req.headers.token
  const boxId = req.body.boxId

  if (!token) return res.status(401).send({ isAuthenticated: false, error: "no_token_provided" })

  jwt.verify(token, secret, (err, decoded) => {
    if (err) {
      if (err) return res.status(500).send({ isAuthenticated: false, error: "token_invalid" })
    } else {

      User.findOne({ email: decoded.email })
      .then((user) => {
        Box.findOne({_id: boxId})
        .then((box) => {
          if (!box) {
            res.status(402).send( { error: "box_not_found"})
          }
          if (box) {
            const receivedCardData = {
              front: req.body.title,
              back: req.body.content,
              tags: req.body.tags,
              __author: user._id,
              __box: box.id
            }

            Card.find().
            where('__box').equals(boxId)
            .then ((result) => {
              receivedCardData["cardNumber"] = (result.length + 1)
              var newCard = new Card(receivedCardData)
              newCard.save()
              user.cards.push(newCard._id)
              box.cards.push(newCard._id)
              user.populate('cards')
              user.save()
              res.status(200).send({ message: "new_card_created", payload: newCard})
            })
            .catch((err) => {
              console.log(err)
              res.status(411).send({err})
            })
            
            
          }
        })
        .catch((error) => {
          res.status(403).send({ error, message: "error_accessing_database"})

        })
      })
      .catch((error) => {
        res.status(403).send({ error, message: "error_accessing_database"})
      })
    }
  })
}
