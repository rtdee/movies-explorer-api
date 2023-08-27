const responses = require('../utils/responses');

module.exports = (err, _req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: responses.internalErr });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next(err);
};
