const assert = require('assert')
const Box = require('../../models/Box')
const app = require('../../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect

chai.use(chaiHttp)

describe('box', async () => {

  it('instance can be created',(done) => {
    const physic1 = new Box({ boxName: "physics one" })
    physic1.save()
      .then(() => {
        assert(!physic1.isNew)
        Box.findOne({ boxName: "physics one"})
          .then((box) => {
            assert(box.boxName == "physics one")
            done()
          })
    })
  })

  it('can be created and pushed to database', async () => {
    const user = await chai.request(app)
                        .post('/signup')
                        .send({ "email": "something2", "password" : "some" })
    const box = new Box({
                        "boxName": "some2",
                        "category": "Physics",
                        "tags":["eins"],
                        "public": false
                    })

    const newBox = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box})

    expect(newBox).to.be.a('object')
    expect(newBox.body.boxName).to.equal('some2')
  })
  
  it('list can be returned', async () => {
    const user = await chai
      .request(app)
      .post('/signup')
      .send({ "email": "some", "password" : "some" })

    const box = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })

    const addBox = async (box) => {
      return await chai.request(app)          
        .post('/api/create_box')
        .set('token', user.body.token)
        .send({box})
    }

    for (var i = 0; i < 10; i++) { 
      await addBox(box)
    }

    const boxList = await chai.request(app)          
      .post('/api/fetch_boxes')
      .set('token', user.body.token)
      .send()

    expect(boxList.body).to.be.a('array')
    expect(boxList.body).to.have.lengthOf(10)
    expect(boxList.status).to.be.equal(200)
  })
  
  it('can return individual box', async () => {
    const user = await chai
    .request(app)
    .post('/signup')
    .send({ "email": "some", "password" : "some" })

    const boxInstance = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })

    const box = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box: boxInstance})
    const requestedBox = await chai
      .request(app)
      .get('/api/fetch_box')
      .set('token', user.body.token)
      .send({ _id: box.body._id})
      
    expect(box.body).to.have.property('_id')
    expect(requestedBox).to.be.an('object')
  })

  it('can be updated', async () => {
    const user = await chai
      .request(app)
      .post('/signup')
      .send({ "email": "some", "password" : "some" })

    const boxInstance = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })
    const updatedBoxInstance = {
      "boxName": "some",
      "category": "Physic",
      "tags":["zwei"],
      "public": true
    }

    const box = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box: boxInstance})

    const requestedBoxUpdate = await chai
      .request(app)
      .put('/api/update_box')
      .set('token', user.body.token)
      .set('id', box.body._id)
      .send({"boxName" : "new"})
      for ( key in requestedBoxUpdate) {
        console.log(key)
      }
    console.log(requestedBoxUpdate)

    // expect(requestedBoxUpdate.body).to.have.property('_id')
    expect(requestedBoxUpdate.body.boxName).to.equal('new')
    expect(requestedBoxUpdate.status).to.be.equal(200)
  })

  it('can be deleted', async () => {
    const user = await chai
      .request(app)
      .post('/signup')
      .send({ "email": "some", "password" : "some" })

    const boxInstance = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })
    
    const box = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box: boxInstance})
    
    const requestBoxDelete = await chai
      .request(app)
      .delete('/api/delete_box')
      .set('token', user.body.token)
      .send({_id: box.body._id})
    
    const requestBox = await chai
      .request(app)
      .get('/api/fetch_box')
      .set('token', user.body.token)
      .send({ _id: box.body._id})
    setTimeout(() => {
    }, 2000)
  })

  it('can have a comment', () => {
    const newComment = {
        text: 'blabla',
        likes: 3
    }
    const newBox = new Box({ comments: [{text: 'blabla'}]})
    newBox.comments.push(newComment)
    newBox.save()
    expect(newBox).to.have.length.valueOf(2)
    expect(newBox.comments).to.be.an('array')
    expect([1, 2, 3]).to.include(2);
    expect([{a: 1},{ b: 2}]).to.deep.include({a: 1});
  })

})