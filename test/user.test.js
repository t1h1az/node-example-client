const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect

chai.use(chaiHttp)

describe('User', async () => {
  it('can be created', async () => {
    const res = await chai.request(app)
                        .post('/signup')
                        .send({ "email": "some", "password" : "some" })
    expect(res).to.be.an('object')
    expect(res.body).to.have.property('token')
    expect(res.status).to.be.equal(200)
  })

  it('can log in', async () => {
    const user = await chai.request(app)
                        .post('/signup')
                        .send({ "email": "something2", "password" : "some" })
    const existingUser = await chai
      .request(app)
      .post('/signin')
      .set('token', user.body.token)
      .send({ "email": "something2", "password" : "some" })

    expect(existingUser).to.be.an('object')
    expect(existingUser.text).to.be.a('string')
    expect(existingUser.status).to.be.equal(200)
  })

  it('can be updated', () => {
    expect(true)
  })

  it('can be set inactive', () => {
    expect(true)
  })
})
