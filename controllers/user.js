const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ConflictError = require('../errors/conflict');
const responses = require('../utils/responses');

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => {
        res.status(201).send({ user });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError(responses.conflict));
        }
        next(err);
      }));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email })
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
