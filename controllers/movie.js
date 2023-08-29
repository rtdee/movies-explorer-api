const Movie = require('../models/movie');
const BadRequestError = require('../errors/bad-request');
const NotFoundError = require('../errors/not-found');
const ForbiddenError = require('../errors/forbidden');
const responses = require('../utils/responses');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((movies) => {
      res.send(movies.filter((movie) => movie.owner.toString() === req.user._id));
    })
    .catch(next);
};

module.exports.postMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    nameRU,
    nameEN,
    owner: req.user._id,
  })
    .then((movie) => {
      if (!movie) {
        throw new BadRequestError(responses.badReq);
      }
      res.status(201).send(movie);
    })
    .catch(next);
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.movieId)
    .orFail(new BadRequestError(responses.badReq))
    .then((movie) => {
      if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(responses.forbidden);
      }
      if (!movie) {
        throw new NotFoundError(responses.notFound);
      }
      return movie.deleteOne()
        .then(res.send(movie));
    })
    .catch(next);
};
