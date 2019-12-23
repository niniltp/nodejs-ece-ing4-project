import express = require('express');

const usersRouter = express.Router();
const user = require('../controllers/users');

usersRouter.post('/', user.create);
usersRouter.get('/', user.getAll);
usersRouter.get('/:username', user.getOne);
usersRouter.delete('/:username', user.delete);

const closeUserDB = () => {
    user.closeDB();
};

module.exports = {usersRouter, closeUserDB};