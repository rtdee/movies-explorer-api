require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const auth = require('./middlewares/auth');
const NotFoundError = require('./errors/not-found');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { createUser } = require('./controllers/user');
const { login } = require('./controllers/login');

const { PORT = 5000, DB_URL = 'mongodb://127.0.0.1:27017/bitfilmsdb' } = process.env;

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(requestLogger);

app.post('/signin', login);
app.post('/signup', createUser);

app.get('/', (req, res) => {
  res.send(req.query);
});

app.use(auth);

app.use('/', require('./routes/user'));
app.use('/', require('./routes/movie'));

app.all('*', (_req, _res, next) => {
  next(new NotFoundError('Не существует'));
});

app.use(errorLogger);
app.use(errors());
app.use((err, _req, res, next) => {
  if (!err.statusCode) {
    res.status(500).send({ message: 'На сервере произошла ошибка' });
  } else {
    res.status(err.statusCode).send({ message: err.message });
  }
  next();
});

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`App listening on port ${PORT}`);
});
