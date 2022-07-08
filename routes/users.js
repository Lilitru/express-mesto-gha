const router = require('express').Router();

const {
  createUser, getUserById, getUsers, updateUserInfo, updateUserAvatar,
} = require('../controllers/users');

router.get('/:userId', getUserById);

router.get('/', getUsers);

router.post('/', createUser);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
