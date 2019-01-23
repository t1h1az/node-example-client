const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoxSchema = new Schema({
  __author: { type: Schema.Types.ObjectId, ref: 'users'},
  boxName: { type: String },
  boxNameNormalized: { type: String},
  boxProgress: { type: Number, default: 1 },
  cards: [{ type: Schema.Types.ObjectId, ref: 'cards' }],
  category: {type: String },
  categoryNormalized: { type: String },
  createdAt: { type: Date, default: Date.now },
  friends: [{ type: Schema.Types.ObjectId, ref: 'users' }],
  likes: { type: Number },
  public: { type: Boolean },
  tags: [{ type: String }],
});

BoxSchema.index({boxName: 'text'})

const Box = mongoose.model('boxes', BoxSchema);

module.exports = Box;
