const mongoose = require('mongoose');
const validator = require('validator');
const responses = require('../utils/responses');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    minLength: [2, 'Минимум 2 знака'],
    maxLength: [30, 'Максимум 30 знаков'],
    required: [true, responses.reqField],
  },
  email: {
    type: String,
    required: [true, responses.reqField],
    validate: {
      validator: (v) => validator.isEmail(v),
      message: responses.badEmail,
    },
  },
  password: {
    type: String,
    required: [true, responses.reqField],
    select: false,
  },
}, { versionKey: false });

module.exports = mongoose.model('user', userSchema);
