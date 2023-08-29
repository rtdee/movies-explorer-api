const router = require('express').Router();
const auth = require('../middlewares/auth');
const NotFoundError = require('../errors/not-found');
const responses = require('../utils/responses');

router.use('/', require('./main'));

router.use(auth);

router.use('/', require('./user'));
router.use('/', require('./movie'));

router.all('*', (_req, _res, next) => {
  next(new NotFoundError(responses.notFound));
});

module.exports = router;
