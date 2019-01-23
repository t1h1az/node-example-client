const app = require('../index')
const mongoose = require('mongoose');
const User = require('../models/User')
const Box = require('../models/Box')
const Card = require('../models/Card')
const chai = require('chai')
const chaiHttp = require('chai-http')

chai.use(chaiHttp)

before(done => {
  mongoose.connection
    .once('open', () => done())
    .on('error', err => {
      done()
    })
});

beforeEach(done => {
  const { users } = mongoose.connection.collections
  users.drop(()=> { 
    done()
  })
});

afterEach((done) => {
  const { users, cards, boxes } = mongoose.connection.collections
  users.drop(() => {
    boxes.drop(() => {
      cards.drop(() => {
        done()
      })
    })
  })
})

after((done)=> {
  mongoose.connection.close()
  done()
})
