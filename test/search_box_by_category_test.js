const assert = require('assert')
const request = require('supertest')
const app = require('../index');

describe('user can search through boxes' ,() => {
  it('by category', (done) => {
    request(app)
    .post('/api/filter_boxes')
    done()
  })
})