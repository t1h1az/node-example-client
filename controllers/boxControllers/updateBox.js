const mongoose = require('mongoose')
const Box = require('../../models/Box')
const { verifyToken } = require('../../services/verifyToken')

exports.updateBox = (req, res) => {
  const token = req.headers.token
  verifyToken(token)
  const boxId = req.headers.id
  
  Box.findByIdAndUpdate(boxId, req.body, {new: true} )
  .exec((error, box) => {
    if (error) {
      res.status(400).send("Box not updated, an error occured" + error)
      return error
    }
    res.status(200).send(box)
    return
  })
}
