const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { updateUser, getUserMe } = require('../controllers/user');

router.get('/users/me', getUserMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    username: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

module.exports = router;
