const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');
const responses = require('../utils/responses');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError(responses.unauthorized);
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'secretkey');
  } catch (err) {
    next(new UnauthorizedError(responses.unauthorized));
  }

  req.user = payload;
  next();
};
