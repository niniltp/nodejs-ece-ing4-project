import express = require('express');

const authRouter = express.Router();
const user = require('../controllers/users');
const redirect = require('../controllers/redirection');
const auth = require('../helpers/authentication');

authRouter.get('/', auth.authCheck, redirect.showIndexPage);

authRouter.post('/login', user.connect);
authRouter.get('/login', redirect.showLoginPage);
authRouter.get('/logout', user.disconnect);

authRouter.get('/signup', redirect.showSignUpPage);

const closeUserAuthDB = () => {
    user.closeDB();
};

module.exports = {authRouter, closeUserAuthDB};