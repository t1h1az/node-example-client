const mongoose = require('mongoose');
const Card = require('../../models/Card');
const Box = require('../../models/Box');
const User = require('../../models/User');
const { verifyToken } = require('../../services/verifyToken');

mongoose.Promise = global.Promise;

exports.createCard = (req, res) => {
  const token = req.headers.token;
  const boxId = req.body.boxId;
  const { email } = verifyToken(token)
  
  User.findOne({ email })
  .then((user) => {
    Box.findOne({_id: boxId})
    .then((box) => {
      if (!box) {
        res.status(402).send( { error: "box_id_missing"})
      }
      if (box) {
        const receivedCardData = {
          title: req.body.title,
          content: req.body.content,
          tags: req.body.tags,
          __author: user._id,
          __box: boxId
        };
        Card.find().
        where('__box').equals(boxId)
        .then ((result) => {
          receivedCardData["cardNumber"] = (result.length + 1)
          var newCard = new Card(receivedCardData);
          newCard.save();
          user.cards.push(newCard._id);
          box.cards.push(newCard._id);
          user.populate('cards')
          box.populate('cards')
          user.save()
          box.save()
          res.status(200).send({ message: "new_card_created", payload: newCard})
        })
        .catch((err) => {
          res.status(411).send({err})
        })
      }
    })
    .catch((error) => {
      res.status(403).send({ error, message: "error_accessing_database"});

    })
  })
  .catch((error) => {
    res.status(403).send({ error, message: "error_accessing_database"});
  })
}
