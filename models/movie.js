const mongoose = require('mongoose');
// const validator = require('validator');
const responses = require('../utils/responses');
const { regexURL } = require('../utils/regexURL');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: [true, responses.reqField],
  },
  director: {
    type: String,
    required: [true, responses.reqField],
  },
  duration: {
    type: Number,
    required: [true, responses.reqField],
  },
  year: {
    type: String,
    required: [true, responses.reqField],
  },
  description: {
    type: String,
    required: [true, responses.reqField],
  },
  image: {
    type: String,
    required: [true, responses.reqField],
    validate: {
      validator: (v) => regexURL.test(v),
      message: responses.badURL,
    },
  },
  trailerLink: {
    type: String,
    required: [true, responses.reqField],
    validate: {
      validator: (v) => regexURL.test(v),
      message: responses.badURL,
    },
  },
  thumbnail: {
    type: String,
    required: [true, responses.reqField],
    validate: {
      validator: (v) => regexURL.test(v),
      message: responses.badURL,
    },
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: mongoose.Schema.Types.ObjectId,
  },
  nameRU: {
    type: String,
    required: [true, responses.reqField],
  },
  nameEN: {
    type: String,
    required: [true, responses.reqField],
  },
}, { versionKey: false });

module.exports = mongoose.model('movie', movieSchema);
