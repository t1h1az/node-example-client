const User = require('../../models/User')
const Box = require('../../models/Box')
const Card = require('../../models/Card')
const { fetchAllBoxes } = require('../boxControllers/readBox')
const contentText = "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet."
const { verifyToken } = require('../../services/verifyToken')

exports.modelController = {
  generateMockUsers: () => {
    let newUser = new User({
      email: "tom@tom.tom",
      password: "hello"
    })
    User.save()
  },
  generateMockBoxes: async (req, res) => {
    for (var i = 0; i <= 1000; i++) {
      let newBox = new Box({
        boxName: "new box title " + i,
        tags: [i, "atag", "btag", "ctag"],
        __author: "5c1262af6e953f13e3d72f8a"
      })
      newBox.save()
    }

    res.status(200).send('success')
  },
  generateMockCards: async (req, res) => {
    Box.find({__author: "5c1262af6e953f13e3d72f8a"})
    .then((boxes, err) => {
      for (var j = 0; j <= 10; j++) {
        for (var i = 0; i <= 1000; i++) {
          console.log('box: ', j, 'card: ',i)
          let newCard = new Card({
            title: "new card title, ask a ask here ",
            content: "# überschrift + bullet + points",
            __box: boxes[j]._id,
            __author: "5c1262af6e953f13e3d72f8a"
          })
          newCard.save()
        }
        boxes[j].populate('cards')
        boxes[j].save()
      }
      res.status(200).send('success')
    })
  },
  fetchUser: (req, res) => {   
    console.log('inc', req.headers.token)
    const decoded = verifyToken(req.headers.token)
    User.findOne({email: decoded.email}).then((user) => {
      res.send(user)
    })
  }
}
