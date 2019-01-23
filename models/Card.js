const mongoose = require('mongoose')
const users =  require('./Card')
const boxes = require('./Box')
const Schema = mongoose.Schema

const CardSchema = new Schema({
  title: { type: String, default: ''},
  content: { type: String, default: ''},
  public: { type: Boolean, default: false },
  cardNumber: { type: Number, default: 1 },
  tags: { type: [String], index: true, default: [] },
  progress: { type: Number, default: 1},
  count: { type: Number, default: 1 },
  __author: { type: Schema.Types.ObjectId, ref: 'users'},
  __box: { type: Schema.Types.ObjectId, ref: 'boxes'},
  createdAt: { type: Date, default: Date.now }
})

const Card = mongoose.model('cards', CardSchema)

module.exports = Card
