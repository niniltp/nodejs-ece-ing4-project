"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var authRouter = express.Router();
var user = require('../controllers/users');
var redirect = require('../controllers/redirection');
var auth = require('../helpers/authentication');
authRouter.get('/', auth.authCheck, redirect.showIndexPage);
authRouter.post('/login', user.connect);
authRouter.get('/login', redirect.showLoginPage);
authRouter.get('/logout', user.disconnect);
authRouter.get('/signup', redirect.showSignUpPage);
var closeUserAuthDB = function () {
    user.closeDB();
};
module.exports = { authRouter: authRouter, closeUserAuthDB: closeUserAuthDB };
