const mongoose = require('mongoose')
const Box = require('../../models/Box')
const User = require('../../models/User')
const { verifyToken } = require('../../services/verifyToken')

mongoose.Promise = global.Promise

exports.createBox = (req, res) => {
  
  const decoded = verifyToken(req.headers.token)

  User.findOne({email: decoded.email})
    .then((user) => {
      const newBox = new Box({
        boxName: req.body.box.boxName,
        category: req.body.box.category,
        public: req.body.box.public,
        tags: req.body.box.tags,
        __author: user._id
      })

      newBox.save()
      user.boxes.push(newBox)
      user.save()
      user.populate('boxes')
      res.status(200).send(newBox)
      return 
    })
    .catch((err) => {
      console.log(err)
      res.status(400).send(err)
    })
}
