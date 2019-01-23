const express = require('express')
const http = require('http')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const mongoose = require('mongoose')


const app = new express()
let clientURL = ""

if (process.env.NODE_ENV === 'test') {
  clientURL = "http://localhost:8080"
  mongoose.connect('mongodb://localhost:27017/flashcard_test1')
  console.log('open connection to database on ENV ' + process.env.NODE_ENV)
} else if (process.env.NODE_ENV === 'production') {
  clientURL = "https://dev.kotei.io"
  mongoose.connect('mongodb://tonystark:needsmoredrinks@ds237445.mlab.com:37445/flashcards_prod')
  console.log('open connection to database on environment ' + process.env.NODE_ENV)
} else if (process.env.NODE_ENV === 'dev'){
  clientURL = "http://localhost:8080"
  mongoose.connect('mongodb://localhost:27017/flashcard_dev')
  console.log('open connection to database on ENV ' + process.env.NODE_ENV)
}
// app.use(morgan('dev')) // logger
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE')
  res.header("Access-Control-Allow-Origin",clientURL)
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, token, id")
  next()
})
app.use(bodyParser.json({type: '*/*'}))

require('./routes/userRoutes')(app)
require('./routes/boxRoutes')(app)
require('./routes/cardRoutes')(app)
require('./routes/adminRoutes')(app)
// require('./routes/uploadRoutes')(app)

app.use((err, req, res, next) => {
  res.status(422).send({error: err.message})
})

const PORT = process.env.PORT || 3090
const server = http.createServer(app)

server.listen(PORT, () => {
  console.log('listening on: ' + PORT )
})

module.exports = app
