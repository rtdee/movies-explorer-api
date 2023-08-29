const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const regexURL = require('../utils/regexURL');

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
    movieId: Joi.string().length(24).hex().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), postMovie);
router.delete('/movies/:movieId', celebrate({
  params: Joi.objectId().keys({
    movieId: Joi.string().length(24).hex().required(),
  }),
}), deleteMovie);

module.exports = router;
