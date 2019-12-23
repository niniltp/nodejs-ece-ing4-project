import express = require('express');

const usersRouter = express.Router();
const user = require('../controllers/users');
const auth = require('../helpers/authentication');

usersRouter.post('/', user.create);
usersRouter.get('/', user.getAll);
usersRouter.get('/:username', user.getOne);
usersRouter.put('/:username', auth.usernameCheck, user.update);
usersRouter.delete('/:username', auth.usernameCheck, user.delete);

const closeUserDB = () => {
    user.closeDB();
};

module.exports = {usersRouter, closeUserDB};