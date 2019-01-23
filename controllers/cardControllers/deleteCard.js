const Card = require('../../models/Card')
const Box = require('../../models/Box')
const User = require('../../models/User')
const mongoose = require('mongoose')
const ObjectId = require('mongoose').Types.ObjectId 
const resetCardNumbers = require('./cardNumberController').resetCardNumbers
const { verifyToken } = require('../../services/verifyToken')

mongoose.Promise = global.Promise

exports.deleteCard = ({ headers : { token, id }}, res) => {
  const { email } = verifyToken(token)

  Card.findOneAndRemove(
    {_id: new ObjectId(id)}, 
    (error, doc) => {
      if (error) {
        res.status(401).send('error occured\n' + err)
        return
      }
      if (doc === null) {
        res.status(300).send({ errorMessage: 'card not found in database'})
        return
      } 
     
      User.findOne({email}, { password: 0 },
        (userError, user) => {
          if (user) {
            user.cards.pull({_id: doc._id})
            user.save()
            Box.findOne({_id: doc.__box})
              .exec((err, box) => {
                if (box) {
                  box.cards.pull({_id: doc._id})
                  box.save()
                  Card.find({__box: doc.__box})
                    .then((cards) => {
                      cards.forEach((card, index) => {
                        card.cardNumber = ++index
                        resetCardNumbers(null, null, doc.__box )
                        card.save()
                      })
                      res.status(200).send({"success": "card deleted"})
                    })
                    .catch((error) => {
                      res.status(400).send({"error": error})
                    })
                  return
                }
                if (err) {
                  res.status(400).send({"error": err})
                  return
                }
              })
          }
          if (userError) {
            res.status(400).send({"error": userError})
            return
          }
        }
      )
    }
  )
}
