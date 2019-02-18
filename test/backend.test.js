const request = require('supertest')
const sinon = require('sinon')
const server = require('../server')
const utils = require('../utils')
const ObjectID = require('mongodb').ObjectID;
mongoose = require('mongoose')
jest.setTimeout(15000);
var db

// Database connection
beforeAll((done) => {
  db = mongoose.connection.on('open', () => {
    done()
  });
});

// Close database connection
afterAll((done) => {
  mongoose.disconnect(() => {
    done()
  })
});

describe('Test fetch all posts', async () => {
  beforeAll(async (done) => {
    // Insert fake data
    await db.collection('posts').deleteMany({})
    await db.collection('posts').insertMany([{
        title: 'a',
        type: 'b',
        body: 'c',
        _id: new ObjectID()
      },
      {
        title: 'e',
        type: 'f',
        body: 'g',
        _id: new ObjectID()
      }
    ])
    done()
  });

  test('It should return a list of posts after minimum 5 second', (done) => {
    var stubOne = sinon.stub(utils, 'ranomNumber');
    var startTime = new Date().getTime();

    stubOne.onCall(0).returns(10);
    request(server).get('/api/v1/posts').then((response) => {
      dateTime = new Date();

      expect(response.statusCode).toBe(200);
      expect(new Date().getTime() - startTime).toBeGreaterThan(5000)
      expect(response.body.status).toBe(true)
      expect(response.body.posts.length).toBe(2)

      expect(response.body.posts[0]['title']).toBe('a')
      expect(response.body.posts[1]['title']).toBe('e')

      stubOne.restore();
      done();
    });
  }, 10000);

  test('It should return a list of posts before 5 second', (done) => {
    var stubTwo = sinon.stub(utils, 'ranomNumber');
    var startTime = new Date().getTime();

    stubTwo.onCall(0).returns(30);
    request(server).get('/api/v1/posts').then((response) => {
      dateTime = new Date();

      expect(response.statusCode).toBe(200);
      expect(new Date().getTime() - startTime).toBeLessThan(5000)
      expect(response.body.status).toBe(true)
      expect(response.body.posts.length).toBe(2)

      expect(response.body.posts[0]['title']).toBe('a')
      expect(response.body.posts[1]['title']).toBe('e')

      stubTwo.restore();
      done();
    });
  });
});


describe('Test delete specific document', async () => {
  beforeEach(async (done) => {
    // Delete all document before every test
    await db.collection('posts').deleteMany({})
    done()
  })

  test('It should delete a specific document properly', async (done) => {
    let newObjectId = new ObjectID()
    await db.collection('posts').insertOne({
      title: 'a',
      type: 'b',
      body: 'c',
      _id: newObjectId
    })

    request(server).delete(`/api/v1/posts/${newObjectId}`).then(async (response) => {
      let records = await db.collection('posts').find({
        _id: newObjectId
      }).toArray()

      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(true)
      expect(records.length).toBe(0);
      done();
    });
  });

  test('It should change zero document because _id is wrong', async (done) => {
    let newObjectId = new ObjectID()
    await db.collection('posts').insertOne({
      title: 'a',
      type: 'b',
      body: 'c',
      _id: newObjectId
    })

    let otherObjectId = new ObjectID()

    request(server).delete(`/api/v1/posts/${otherObjectId}`).then(async (response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(false)
      let records = await db.collection('posts').find({}).toArray()
      expect(records.length).toBe(1);
      done();
    });
  });
});


describe('create a new document', () => {
  beforeEach(async (done) => {
    await db.collection('posts').deleteMany({})
    done()
  })

  test('It should return validation error', async (done) => {
    request(server).post(`/api/v1/posts`).send({}).then(async (response) => {
      expect(response.statusCode).toBe(200);
      expect(response.body.status).toBe(false)
      done();
    });
  });

  test('It should return 500 error for 10% condition', async (done) => {
    var stubOne = sinon.stub(utils, 'ranomNumber');
    stubOne.onCall(0).returns(5);
    request(server).post(`/api/v1/posts`).send({
      title: 'test',
      type: 'article'
    }).end((err, response) => {
      expect(response.statusCode).toBe(500);
      stubOne.restore();
      done();
    });
  });

  test('It should create a new document with 5 second delay', async (done) => {
    var stubOne = sinon.stub(utils, 'ranomNumber');
    stubOne.onCall(0).returns(20);
    stubOne.onCall(1).returns(6000);

    var startTime = new Date().getTime();
    request(server).post(`/api/v1/posts`).send({
      title: 'test',
      type: 'article'
    }).end(async (err, response) => {
      expect(response.statusCode).toBe(200);

      let durationTime = new Date().getTime() - startTime
      expect(durationTime).toBeGreaterThan(5000)
      expect(durationTime).toBeLessThan(10000)

      expect(response.body.status).toBe(true)

      let records = await db.collection('posts').find({}).toArray()
      expect(records.length).toBe(1);

      stubOne.restore();
      done();
    });
  }, 10000);

  test('It should create a new document before 5 second delay', async (done) => {
    var stubOne = sinon.stub(utils, 'ranomNumber');
    stubOne.onCall(0).returns(40);
    var startTime = new Date().getTime();
    request(server).post(`/api/v1/posts`).send({
      title: 'test',
      type: 'article'
    }).end(async (err, response) => {
      expect(response.statusCode).toBe(200);
      expect(new Date().getTime() - startTime).toBeLessThan(5000)
      expect(response.body.status).toBe(true)

      let records = await db.collection('posts').find({}).toArray()
      expect(records.length).toBe(1);

      stubOne.restore();
      done();
    });
  }, 10000);
});


describe('Test utils methods', () => {
  test('Test delay function', async (done) => {
    var startTime = new Date().getTime();
    await utils.delay(3000)

    let durationTime = new Date().getTime() - startTime
    expect(durationTime).toBeGreaterThan(3000)

    done()
  }, 3000);

  test('Test random number', async (done) => {
    let number = await utils.ranomNumber(1, 10)
    expect(number).toBeGreaterThan(0)
    expect(number).toBeLessThan(11)

    done()
  });
});