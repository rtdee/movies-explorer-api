require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cors = require('cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const { dbDevConfig } = require('./utils/dbDevConfig');
const errorHandler = require('./middlewares/errorHandler');
const { rateLimiter } = require('./middlewares/rateLimiter');

const { PORT = 5000, DB_URL = dbDevConfig } = process.env;

const app = express();

app.use(rateLimiter);
app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.connect(DB_URL);

app.use(requestLogger);

app.use('/', require('./routes/index'));

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);
app.listen(PORT);
