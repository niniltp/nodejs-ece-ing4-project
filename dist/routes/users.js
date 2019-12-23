"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var usersRouter = express.Router();
var user = require('../controllers/users');
var auth = require('../helpers/authentication');
usersRouter.post('/', user.create);
usersRouter.get('/', user.getAll);
usersRouter.get('/:username', user.getOne);
usersRouter.put('/:username', auth.authCheck, user.update);
usersRouter.delete('/:username', auth.authCheck, user.delete);
var closeUserDB = function () {
    user.closeDB();
};
module.exports = { usersRouter: usersRouter, closeUserDB: closeUserDB };
