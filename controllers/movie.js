const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');

module.exports.getMovies = (_req, res, next) => {
  Movie.find({})
    .then((movies) => res.send(movies))
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const {
    country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN,
  } = req.body;

  Movie.create({ country, director, duration, year, description, image, trailerLink, thumbnail, nameRU, nameEN, owner: req.user._id })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError('Введены некорректные данные');
      }
      res.status(201).send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new BadRequestError('Введены некорректные данные'))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Нет доступа');
      }
      if (!movie) {
        throw new NotFoundError(`Фильм с ID ${req.params.movieId} не найден`);
      }
      movie.deleteOne(movie)
        .then(res.send(movie));
    })
    .catch(next);
};