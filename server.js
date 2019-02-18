'use strict';

const express = require('express');
const mongoose = require('mongoose');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const {
  check,
  validationResult
} = require('express-validator/check');
const utils = require('./utils');

require('dotenv').config();

// #####################################
// MongoDB Connection
// connects our back end code with the database
mongoose.connect(
  `mongodb://${process.env.DB_HOST}:${process.env.DB_PORT}/${
		process.env.DB_NAME
	}`, {
    useNewUrlParser: true,
  },
);
var Post;
const db = mongoose.connection;
// checks if connection with the database is successful or not
db.once('open', () => {
  Post = mongoose.model('posts', {
    title: String,
    type: String,
    body: String,
  });
});
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// #####################################
// Express server configuration
const server = express();
server.use(
  bodyParser.urlencoded({
    extended: false,
  }),
);
server.use(bodyParser.json());

// #####################################
/**
 * Return a list of all posts on the db.
 * @return {object} posts - list of documents in posts collection
 */
server.get('/api/v1/posts', async (req, res) => {
  // execute a query to fetch the doucments
  const posts = await Post.find({}).exec();

  // genrate a ranom number and evaluate for 20% condition
  const ranomNumber = utils.ranomNumber(0, 100);
  if (ranomNumber <= 20) {
    await utils.delay(5000);
  }

  return res.json({
    status: true,
    posts,
    messages: [],
  });
});

/**
 * Write a new document in posts collection.
 * @param {string} title (required) - title of the post
 * @param {string} type (required) - kind of the post
 * @param {string} body (optional) - content of the post
 * @return {object}
 */
server.post(
  '/api/v1/posts',
  [
    // Input validation
    check('title')
    .not()
    .isEmpty(),
    check('type')
    .not()
    .isEmpty(),
  ],
  async (req, res) => {
    // check result of the validaiton
    const errors = validationResult(req);
    // return list of messages if there is exists
    if (!errors.isEmpty()) {
      return res.status(400).json({
        status: false,
        messages: utils.normalizeValidationError(errors.array()),
      });
    }

    // genrate a ranom number and evaluate for 10% condition
    const ranomNumber = utils.ranomNumber(0, 100);
    if (ranomNumber <= 10) {
      return res.status(500).json({
        status: false,
        messages: [],
      });
    }

    // Create a n ew document and fill that with posted data
    const newPost = new Post({
      title: req.body.title,
      type: req.body.type,
    });
    await newPost.save();

    // again genrate a ranom number and evaluate for 20% condition
    if (ranomNumber <= 30 && ranomNumber > 10) {
      await utils.delay(utils.ranomNumber(5000, 10000));
    }

    return res.json({
      status: true,
    });
  },
);

/**
 * Delete a specific post.
 * @param {id} id (required) - the _id of the document that should be delete
 * @return {object}
 */
server.delete('/api/v1/posts/:id', async (req, res) => {
  // Find the intended document
  const findedPost = await Post.findOne({
    _id: ObjectID(req.params.id),
  }).exec();

  // Return error if could't find any document
  if (!findedPost) {
    return res.json({
      status: false,
      messages: ["can't find the your post"],
    });
  }

  // Remove finded document
  await findedPost.delete();

  return res.json({
    status: true,
    messages: [],
  });
});

module.exports = server;