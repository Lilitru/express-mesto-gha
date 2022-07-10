const card = require('../models/card');

const {
  ERROR_CODE_403,
  ERROR_CODE_404,
} = require('../utils/constants');

module.exports.createCard = (req, res, next) => {
  const { name, link, owner = req.user._id } = req.body;

  card.create({ name, link, owner })
    .then((newCard) => res.status(201).send(newCard))
    .catch(next);
};

module.exports.getCards = (req, res, next) => {
  card.find({})
    .then((cards) => res.send(cards))
    .catch(next);
};

module.exports.deleteCard = (req, res, next) => {
  card.findById(req.params.cardId)
    .then((existingCard) => {
      if (!existingCard) {
        const err = new Error('Карточка не найдена');
        err.statusCode = ERROR_CODE_404;
        throw err;
      } else if (existingCard.owner.toString() === req.user._id) {
        existingCard.remove()
          .then((removedCard) => res.send(removedCard));
      } else {
        const err = new Error('Пользователь не может удалить карточку, созданную другим пользователем');
        err.statusCode = ERROR_CODE_403;
        throw err;
      }
    })
    .catch(next);
};

module.exports.likeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    .then((newCard) => {
      if (!newCard) {
        const err = new Error('Карточка не найдена');
        err.statusCode = ERROR_CODE_404;
        throw err;
      } else {
        res.send(newCard);
      }
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    .then((newCard) => {
      if (!newCard) {
        const err = new Error('Карточка не найдена');
        err.statusCode = ERROR_CODE_404;
        throw err;
      } else { res.send(newCard); }
    })
    .catch(next);
};
