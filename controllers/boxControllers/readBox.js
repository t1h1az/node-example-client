'use strict'

const mongoose = require('mongoose')
const User = require('../../models/User')
const Box = require('../../models/Box')
const { verifyToken } = require('../../services/verifyToken')

mongoose.Promise = Promise

// ===================     FETCH ONE BOX   =================================
// =========================================================================

exports.fetchBox = (req, res) => {
  const token = req.headers.token
  verifyToken(token)
  const boxId = req.body._id
  if (boxId==undefined) {return res.status(402).send({ error: "no_box_id_provided"})}
  Box.find({ _id: boxId})
    .populate('cards')
    .exec((error, box) => {
      if (error) {
        res.status(400).send({ error: "error_on_box_fetch"})
        return
      }
      if (box === null) {
        res.status(400).send({ error: "box_not_found"})
        return
      }
      res.status(200).send(box)
      return
    })
}

// ===================     FETCH ALL BOXES   =================================
// =========================================================================

exports.fetchAllBoxes = (req, res, option) => {
  
  if (!option) {
    const token = req.headers.token
    var { email } = verifyToken(token)
  } else {
    var email = option.email 
  }
  
  User.findOne({email})
  .populate('boxes')
  .exec((error, user) => {
    if(error) {
      res.status(401).send({error: "error accessing database"})
    }
    if(user === null) {
      res.status(400).send({error: "user_not_found"})
      return
    }
    Box.find({__author: user._id})
    .limit(500)
    .then((boxes) => { 
      res.status(200).send(boxes)
      return
    })
  })
}

// ===================     FETCH ALL PUBLIC BOXES   =================================
// =========================================================================

exports.fetchAllPublicBoxes = (req, res) => {
  const token = req.headers.token
  verifyToken(token)

  Box.find({public: true})
  .exec((error, boxes) => {
      if(boxes === null) {
        res.status(400).send({error: "boxes_not_found"})
      }
      if(error) {
        res.status(401).send({error: "error_on_fetching_private_boxes_from_database"})
      }
      if (boxes === []) {
        res.status(200).send({message: "no_boxes"})
      }
      res.status(200).send(boxes)
    })
}

// =========================================================================

exports.fetchBoxesByCategory = (req, res) => {
  const token = req.headers.token
  verifyToken(token)
  const category = req.body.categoryFilter

  Box.find({category})
  .exec((error, boxes) => {
      if(boxes === null) {
        res.status(400).send({error: "boxes_not_found"})
      }
      if(error) {
        res.status(401).send({error: "error_on_fetching_private_boxes_from_database"})
      }
      if (boxes === []) {
        res.status(200).send({message: "no_boxes"})
      }
      res.status(200).send(boxes)
    })
}

// =========================================================================

exports.fetchBoxByName = (req, res) => {
  const token = req.headers.token
  verifyToken(token)
  const searchTerm = req.body.searchTerm

  Box.find({$text: { $search: searchTerm}})
  .exec((error, boxes) => {
      if(boxes === null) {
        res.status(400).send({error: "boxes_not_found"})
        return
      }
      if(error) {
        res.status(401).send({error: "error_on_fetching_private_boxes_from_database"})
        return
      }
      if (boxes == []) {
        res.status(200).send({message: "no_boxes"})
        return
      }
      res.status(200).send(boxes)
      return
    })
}
