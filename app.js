const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi } = require('celebrate');
const { errors } = require('celebrate');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const { login, createUser } = require('./controllers/users');
const auth = require('./middlewares/auth');

const {
  ERROR_CODE_400,
  ERROR_CODE_409,
  ERROR_CODE_500,
  validateUrl,
} = require('./utils/constants');

const PORT = 3000;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата

app.use('/users', auth, userRouter);
app.use('/cards', auth, cardRouter);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateUrl),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use(errors());

app.use((err, req, res, next) => {
  // если у ошибки нет статуса, выставляем 500
  const { statusCode = ERROR_CODE_500, message, name } = err;

  if (name === 'ValidationError' || name === 'CastError') {
    res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  } else if (statusCode === ERROR_CODE_409) {
    res.status(ERROR_CODE_409).send({ message: 'Невозможно использовать указанную почту - пользователь с указанной почтой уже зарегистрирован' });
  } else {
    res
      .status(statusCode)
      .send({
        // проверяем статус и выставляем сообщение в зависимости от него
        message: statusCode === ERROR_CODE_500
          ? 'На сервере произошла ошибка'
          : message,
      });
  }

  next();
});

app.listen(PORT, () => {
  console.log('listening port 3000');
});
