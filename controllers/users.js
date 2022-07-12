const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const user = require('../models/user');

const UnauthorizedError = require('../errors/UnauthorizedError');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ConflictingRequestError = require('../errors/ConflictingRequestError');

module.exports.createUser = (req, res, next) => {
  const {
    name, about, avatar, email, password,
  } = req.body;

  user.findOne({ email })
    .then((existingUser) => {
      if (existingUser) {
        throw new ConflictingRequestError('Пользователь с таким email уже существует');
      }
      return bcrypt.hash(password, 10)
        .then((hash) => user.create({
          name, about, avatar, email, password: hash,
        }))
        .then((createdUser) => user.findOne({ _id: createdUser._id }))
        .then((userWithoutPass) => {
          res.status(201).send(userWithoutPass);
        });
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else if (err.code === 11000) {
        next(new ConflictingRequestError('Пользователь с таким email уже существует'));
      } else {
        next(err);
      }
    });
};

module.exports.getUserById = (req, res, next) => {
  user.findById(req.params.userId)
    .then((newUser) => {
      if (!newUser) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send(newUser);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
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
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send(newUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
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
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send(newUser);
      }
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return next(new BadRequestError('Переданы некорректные данные'));
      }
      return next(err);
    });
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
    .catch((err) => {
      if (err.message === 'IncorrectEmail') {
        next(new UnauthorizedError('Не правильный логин или пароль'));
      }
      next(err);
    });
};

module.exports.getUserInfo = (req, res, next) => {
  user.findById(req.user._id)
    .then((currentUser) => {
      if (!currentUser) {
        throw new NotFoundError('Запрашиваемый пользователь не найден');
      } else {
        res.send(currentUser);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные.'));
      } else {
        next(err);
      }
    });
};
