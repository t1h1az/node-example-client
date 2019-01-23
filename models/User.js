const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: {type: String, unique: true, lowercase: true},
  username: {type: String, unique: true},
  password: String,
  personalData: {
    street: {type: String},
    number: {type: String},
    zip: {type: String},
    city: {type: String},
    country: {type: String, default: 'Deutschland'},
    mobileNumber: {type: String},
    company: {type: String},
    position: {type: String},
    school: {type: String},
    schoolClass: {type: String}
  },
  boxes: [{
    type: Schema.Types.ObjectId,
    ref: 'boxes'
  }],
  cards: [{
    type: Schema.Types.ObjectId,
    ref: 'cards'
  }],
  friends: [{
    type: Schema.Types.ObjectId,
    ref: 'users'
  }],
  admin: {type: Boolean, default: false},
  beginner: {type: Boolean, default: true},
  intermediate: {type: Boolean, default: false},
  advanced: {type: Boolean, default: false},
  lastBox: { type: String, default: -1},
  lastCard: {
    type: Schema.Types.ObjectId,
    ref: 'cards'
  }
});

UserSchema.pre('save', function(next) {
  const user = this;
  
  if (!user.isModified('password')) return next();

  bcrypt.genSalt(10, function(err, salt) {
    if (err) {return next(err);}

    bcrypt.hash(user.password, salt, null, function (err, hash){
      if (err) {return next(err);}

      user.password = hash;
      next();
    });
  });
});

UserSchema.methods.comparePassword = function(candidatePassword, hashedPassword, callback) {
  bcrypt.compare(candidatePassword, hashedPassword, function(err, isMatch) {
    if (err) {
      return callback(err);
    }
    callback(null, isMatch);
  });
};

const User = mongoose.model('users', UserSchema);

module.exports = User;
