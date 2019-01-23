const assert = require('assert');
const request = require('supertest');
const app = require('../index');

describe('App', () => {
  it('is running', (done) => {
    request(app)
      .get('/')
      .end((err, response) => {
        assert(response.body.hi = 'there');
        done();
      })
  });
});
