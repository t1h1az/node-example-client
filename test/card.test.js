const assert = require('assert')
const Box = require('../models/Box')
const Card = require('../models/Card')
const app = require('../index')
const chai = require('chai')
const chaiHttp = require('chai-http')
const expect = require('chai').expect

chai.use(chaiHttp)

describe('card', async () => {

  it('instance can be created',() => {
    const physic1 = new Card({ 
        title: "physics one" 
      })
    physic1.save()
      .then(() => {
        assert(!physic1.isNew)
        Card.findOne({ title: "physics one"})
          .then((card) => {
            assert(card.title == "physics one")
          })
    })
  })

  it('can be created and pushed to database', async () => {
    const user = await chai
      .request(app)
      .post('/signup')
      .send({ "email": "something2", "password" : "some" })
    const box = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })

    const receivedBox = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box})

    const card = await new Card({
      "title": "title of created card",
      "content": "<div>scniff</div><p>piff</p>",
      "tags":["eins", "zwei", "meine", "neue", "card"],
      "__box": receivedBox.body._id,
      "__author": user.body._id
    })

    const receivedCard = await chai.request(app)      
      // .then(() => console.log(receivedBox))    
      .post('/api/create_card')
      .set('token', user.body.token)
      .send(card)

    expect(true)
    expect(receivedCard).to.be.a('object')
    console.log(receivedCard)
    // expect(receivedCard.body.payload.title).to.equal('title of created card')
  })
  
  it('list can be returned', async () => {
    const user = await chai
      .request(app)
      .post('/signup')
      .send({ "email": "something2", "password" : "some" })
    const box = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })

    const receivedBox = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box})
      console.log(receivedBox.body)
      for (var i = 0; i < 9; i++) { 
      const card = new Card({
        "title": `title of created ca${i}`,
        "content": "<div>scniff</div><p>piff</p>",
        "tags":["eins", "zwei", "meine", "neue", "card"],
        "__box": receivedBox.body._id,
        "__author": user.body._id
      })
      const addCard = async function(card) {
        chai.request(app)          
          .post('/api/create_card')
          .set('token', user.body.token)
          .send(card)
      }

      await addCard(card)
    }

    const cardList = await chai.request(app)          
      .post('/api/fetch_cards')
      .set('token', user.body.token)
      .set('id', receivedBox.body._id)
      .send()

    console.log(cardList.body)

    expect(cardList.body).to.be.a('array')
    expect(cardList.body).to.have.lengthOf(10)
    expect(cardList.status).to.be.equal(200)
  })

  it('can be read', async () => {
    const user = await chai
      .request(app)
      .post('/signup')
      .send({ "email": "something2", "password" : "some" })

    const box = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })

    const receivedBox = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box})

    const card = await new Card({
      "front": "title of created card",
      "back": "<div>scniff</div><p>piff</p>",
      "tags":["eins", "zwei", "meine", "neue", "card"],
      "__box": receivedBox.body._id,
      "__author": user.body._id
    })

    const receivedCard = await chai.request(app)          
      .post('/api/create_card')
      .set('token', user.body.token)
      .send(card)

    const singleCard = await chai
      .request(app)          
      .get('/api/fetch_card')
      .set('token', user.body.token)
      .send({"id": receivedCard.body.payload._id})

    expect(singleCard).to.be.an('object')
  })

  it('can be updated', async () => {
    const user = await chai
      .request(app)
      .post('/signup')
      .send({ "email": "tom@beetz.de", "password" : "mypass" })

    const box = new Box({
      "boxName": "some2",
      "category": "Physics",
      "tags":["eins"],
      "public": false
    })

    const receivedBox = await chai.request(app)          
      .post('/api/create_box')
      .set('token', user.body.token)
      .send({box})

    const card = await new Card({
      "front": "title of created card",
      "back": "<div>scniff</div><p>piff</p>",
      "tags":["eins", "zwei", "meine", "neue", "card"],
      "__box": receivedBox.body._id,
      "__author": user.body._id
    })

    const modifiedCard = {
      "front": "updated title of created card",
      "back": "<div>schniff</div><p>piff</p>",
      "tags":["eins", "zwei", "meine", "neue", "card"],
    }

    const receivedCard = await chai.request(app)          
      .post('/api/create_card')
      .set('token', user.body.token)
      .send(card)

    const requestCardUpdate = await chai
      .request(app)
      .put('/api/update_card')
      .set('token', user.body.token)
      .set('id', receivedCard.body.payload._id)
      .send(modifiedCard)
    
    expect(receivedCard).to.be.a('object')
    expect(receivedCard.body.payload.front).to.equal('title of created card')
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
      console.log(requestBox.body)
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