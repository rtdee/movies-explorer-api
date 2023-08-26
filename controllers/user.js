const bcrypt = require('bcrypt');
const User = require('../models/user');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ConflictError = require('../errors/conflict');

module.exports.createUser = (req, res, next) => {
  const {
    name, email,
  } = req.body;

  bcrypt.hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash,
    })
      .then((user) => {
      // eslint-disable-next-line no-param-reassign
        user.password = undefined;
        res.status(201).send({ user });
      })
      .catch((err) => {
        if (err.code === 11000) {
          next(new ConflictError('Пользователь уже существует'));
        }
        next();
      }));
};

module.exports.updateUser = (req, res, next) => {
  const { name, email } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, email })
    .then((user) => res.send({ user }))
    .catch(next);
};

module.exports.getUserMe = (req, res, next) => {
  const { email } = req.body;
  User.findById(req.user._id)
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((user) => {
      if (!user) {
        throw new NotFoundError(`Пользователь с email ${email} не найден`);
      }
      res.send(user);
    })
    .catch(next);
};
