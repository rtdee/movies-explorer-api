const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regexURL = require('../utils/regexURL');
const { createUser } = require('../controllers/user');
const { login } = require('../controllers/login');
const auth = require('../middlewares/auth');

// main routes
router.get('/', (req, res) => {
  res.send(req.query);
});

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

// user routes
const { updateUser, getUserMe } = require('../controllers/user');

router.get('/users/me', getUserMe);
router.patch('/users/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
  }),
}), updateUser);

// movie routes
const { getMovies, postMovie, deleteMovie } = require('../controllers/movie');

router.get('/movies', getMovies);
router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(RegExp(regexURL)),
    trailerLink: Joi.string().required().regex(RegExp(regexURL)),
    thumbnail: Joi.string().required().regex(RegExp(regexURL)),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), deleteMovie);

module.exports = router;
