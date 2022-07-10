const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');

const { validateUrl } = require('../utils/constants');

const {
  // createUser,
  getUserById, getUsers, updateUserInfo, updateUserAvatar, getUserInfo,
} = require('../controllers/users');

router.get('/me', getUserInfo);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().required().alphanum().length(24),
  }),
}), getUserById);

router.get('/', getUsers);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUserInfo);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().custom(validateUrl),
  }),
}), updateUserAvatar);

module.exports = router;
