const mongoose = require('mongoose');
const User = require('../../models/User');
const Card = require('../../models/Card');
const { verifyToken } = require('../../services/verifyToken');

exports.updateCard = (req, res) => {
  console.log(req.headers)
    const token = req.headers.token;
    verifyToken(token)
    const cardId = req.headers.id;

    Card.findByIdAndUpdate(cardId, req.body, {new: true} )
     .exec((error, card) => {
        if (error) {
          res.status(400).send("error on finding and updating card");
          return error;
        }
        if (card) {
          res.status(200).send({success: 'card has been successfully updated', payload: card});
          return card;
        }
        res.status(401).send(cardId);
      });
}

exports.updateCardProgress = (req, res) => {
  const token = req.headers.token
  const cardId = req.body.cardId
  const operator = req.body.operator
  verifyToken(token)
  switch(operator) {
    case "inc":
      var card = Card.findById(cardId)
      
      card
      .then((card) => {
        if (card.progress >= 10) {
          res.status(200).send(card)
          return card
        }
        ++card.progress
        card.save()
        res.status(200).send(card)
        return card
      })
      .catch((error) => {
        res.status(400).send(error);
        return error
      }) 
      return
    case "dec":
      var card = Card.findById(cardId)
      card.then((card) => {
        if (card.progress <= 1) {
          res.status(200).send(card)
          return card
        }
        --card.progress
        card.save()
        res.status(200).send(card)
        return card
      })
      .catch((error) => {
        res.status(400).send(error);
        return error
      }) 
      return
    default: 
      res.status(300).send('no or false operator')
      return
  }
}
