const { createUser, getUserById, getUsers, updateUserInfo, updateUserAvatar } = require('../controllers/users');

const router = require('express').Router();

router.get('/:userId', getUserById);

router.get('/', getUsers);

router.post('/', createUser);

router.patch('/me', updateUserInfo);

router.patch('/me/avatar', updateUserAvatar);

module.exports = router;