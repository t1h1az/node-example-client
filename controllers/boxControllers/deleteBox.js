const Box = require('../../models/Box')
const mongoose = require('mongoose')
const { verifyToken } = require('../../services/verifyToken')

mongoose.Promise = Promise

exports.deleteBox = (req, res) => {

  const boxToDelete = req.body._id
  verifyToken(req.headers.token)
    
  Box.findOneAndRemove(
    {_id: boxToDelete}, 
    (error, doc) => {
    if (error) {
      res.status(400).send(error)
    }
    res.status(200).send(doc)
  })
}
