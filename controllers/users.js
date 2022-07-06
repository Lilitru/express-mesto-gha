const user = require('../models/user');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/constants');

module.exports.createUser = (req, res) => {
  const { name, about, avatar } = req.body;

  if (!name || !about || !avatar)
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });

  user.create({ name, about, avatar })
    .then(user => res.send(user))
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.getUserById = (req, res) => {
  user.findById(req.params.userId)
    .then(user => {
      if (!user)
        res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
      else
        res.send(user)
    })
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.getUsers = (req, res) => {
  user.find({})
    .then(users => res.send(users))
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.updateUserInfo = (req, res) => {

  const { name, about, id = req.user._id } = req.body;

  if (!name || !about || !id)
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });

  user.findByIdAndUpdate(
    id,
    { name: name, about: about },
    { new: true },
  )
    .then(user => {
      if (!user)
        res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
      else
        res.send(user)
    })
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));

};

module.exports.updateUserAvatar = (req, res) => {

  const {avatar, id = req.user._id } = req.body;

  if (!avatar || !id)
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });

  user.findByIdAndUpdate(
    id,
    {avatar: avatar},
    { new: true },
  )
    .then(user => {
      if (!user)
        res.status(ERROR_CODE_404).send({ message: 'Запрашиваемый пользователь не найден' });
      else
        res.send(user)
    })
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};