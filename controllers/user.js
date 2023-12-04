const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ConflictError = require('../errors/conflict');
const responses = require('../utils/responses');

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports.createUser = (req, res, next) => {
  const {
    username, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      username, email, password: hash,
    })
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'secretkey', { expiresIn: '7d' });
        res.send(JSON.stringify(token));
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError(responses.conflict));
        }
        next(err);
      }));
};

module.exports.updateUser = (req, res, next) => {
  const { username, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { username, email })
    .then((user) => res.send({ user }))
    .catch((err) => {
      if (err.code === 11000) {
        next(new ConflictError(responses.conflict));
      }
      next(err);
    });
};

module.exports.getUserMe = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(new BadRequestError(responses.badReq))
    .then((user) => {
      if (!user) {
        throw new NotFoundError(responses.notFound);
      }
      res.send(user);
    })
    .catch(next);
};
