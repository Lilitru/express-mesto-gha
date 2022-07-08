const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const userRouter = require('./routes/users');
const cardRouter = require('./routes/cards');

const PORT = 3000;

const app = express();

app.use(bodyParser.json()); // для собирания JSON-формата

app.use((req, res, next) => {
  req.user = {
    _id: '62c50f8be2be4bb116afe302', // вставьте сюда _id созданного в предыдущем пункте пользователя
  };

  next();
});

app.use('/users', userRouter);
app.use('/cards', cardRouter);

app.use('*', (req, res) => {
  res.status(404).send({ message: 'Not found' });
});

mongoose.connect('mongodb://localhost:27017/mestodb');

app.listen(PORT, () => {
  console.log('listening port 3000');
});
