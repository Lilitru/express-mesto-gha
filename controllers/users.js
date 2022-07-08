const user = require('../models/user');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar) {
    res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  } else {
    user.create({ name, about, avatar })
      .then((newUser) => res.status(201).send(newUser))
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` });
        }
      });
  }
};

module.exports.getUserById = (req, res) => {
  user.findById(req.params.userId)
    .then((newUser) => {
      if (!newUser) {
        res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
      } else {
        res.send(newUser);
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
      } else {
        res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` });
      }
    });
};

module.exports.getUsers = (req, res) => {
  user.find({})
    .then((users) => res.send(users))
    .catch((err) => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about, id = req.user._id } = req.body;

  if (!name || !about || !id) {
    res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  } else {
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
          res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
        } else {
          res.send(newUser);
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
        } else if (err.name === 'CastError') {
          res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` });
        }
      });
  }
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar, id = req.user._id } = req.body;

  if (!avatar || !id) {
    res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
  } else {
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
          res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
        } else {
          res.send(newUser);
        }
      })
      .catch((err) => {
        if (err.name === 'ValidationError') {
          res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
        } else if (err.name === 'CastError') {
          res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });
        } else {
          res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` });
        }
      });
  }
};
