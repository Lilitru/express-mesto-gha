const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const {
  ERROR_CODE_404,
  ERROR_CODE_409,
} = require('../utils/constants');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  user.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        const err = new Error('Пользователь с таким email уже существует');
        err.statusCode = ERROR_CODE_409;
        throw err;
      }
      bcrypt.hash(password, 10)
        .then((hash) => user.create({
          name, about, avatar, email, password: hash,
        }))
        .then((createdUser) => user.findOne({ _id: createdUser._id }))
        .then((userWithoutPass) => {
          res.status(201).send(userWithoutPass);
        });
    })
    .catch(next);
};

module.exports.getUserById = (req, res, next) => {
  user.findById(req.params.userId)
    .then((newUser) => {
      if (!newUser) {
        const err = new Error('Запрашиваемый пользователь не найден');
        err.statusCode = ERROR_CODE_404;
        throw err;
      } else {
        res.send(newUser);
      }
    })
    .catch(next);
};

module.exports.getUsers = (req, res, next) => {
  user.find({})
    .then((users) => res.send(users))
    .catch(next);
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, about, id = req.user._id } = req.body;

  user.findByIdAndUpdate(
    id,
    { name, about },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUser) => {
      if (!newUser) {
        const err = new Error('Запрашиваемый пользователь не найден');
        err.statusCode = ERROR_CODE_404;
        throw err;
      } else {
        res.send(newUser);
      }
    })
    .catch(next);
};

module.exports.updateUserAvatar = (req, res, next) => {
  const { avatar, id = req.user._id } = req.body;

  user.findByIdAndUpdate(
    id,
    { avatar },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((newUser) => {
      if (!newUser) {
        const err = new Error('Запрашиваемый пользователь не найден');
        err.statusCode = ERROR_CODE_404;
        throw err;
      } else {
        res.send(newUser);
      }
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  user.findUserByCredentials(email, password)
    .then((currentUser) => {
      // создадим токен
      const token = jwt.sign({ _id: currentUser._id }, 'some-secret-key', { expiresIn: '7d' });
      // вернём токен
      // res.send({ token });

      res.cookie('token', token, {
        expiresIn: '7d',
        httpOnly: true,
        sameSite: true,
      });
      res.status(200).send({ message: 'Авторизация пройдена', token });
    })
    .catch(next);
};

module.exports.getUserInfo = (req, res, next) => {
  user.findById(req.user._id)
    .then((currentUser) => {
      if (!currentUser) {
        const err = new Error('Запрашиваемый пользователь не найден');
        err.statusCode = ERROR_CODE_404;
        throw err;
      } else {
        res.send(currentUser);
      }
    })
    .catch(next);
};
