const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/unauthorized');

const extractBearerToken = (header) => header.replace('Bearer ', '');

module.exports = (req, _res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Требуется авторизация');
  }

  const token = extractBearerToken(authorization);
  let payload;

  try {
    payload = jwt.verify(token, 'secretkey');
  } catch (err) {
    next(new UnauthorizedError('Требуется авторизация'));
  }

  req.user = payload;
  next();
};
