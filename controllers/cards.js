
const card = require('../models/card');

const {
  ERROR_CODE_400,
  ERROR_CODE_404,
  ERROR_CODE_500,
} = require('../utils/constants');

module.exports.createCard = (req, res) => {

  const { name, link, owner = req.user._id } = req.body;

  if (!name || !link || !owner)
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });

  card.create({ name, link, owner })
    .then(card => res.send(card))
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.getCards = (req, res) => {
  card.find({})
    .then(cards => res.send(cards))
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.deleteCard = (req, res) => {
  card.findByIdAndRemove(req.params.cardId)
    .then(card => {
      if (!card)
        res.status(ERROR_CODE_404).send({ message: 'Карточка не найдена' });
      else
        res.send(card)
    })
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.likeCard = (req, res) => {

  if(!req.user._id)
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });

  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then(card => {
      if (!card)
        res.status(ERROR_CODE_404).send({ message: 'Карточка не найдена' });
      else
        res.send(card)
    })
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};

module.exports.dislikeCard = (req, res) => {

  if(!req.user._id)
    return res.status(ERROR_CODE_400).send({ message: 'Переданы некорректные данные' });

  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
  .then(card => {
    if (!card)
      res.status(ERROR_CODE_404).send({ message: 'Карточка не найдена' });
    else
      res.send(card)
  })
    .catch(err => res.status(ERROR_CODE_500).send({ message: `Произошла ошибка ${err.name} с текстом ${err.message}` }));
};