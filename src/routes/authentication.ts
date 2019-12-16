import express = require('express');

const router = express.Router();
const users = require('../controllers/users');
const redirect = require('../controllers/redirection');
const auth = require('../helpers/authentication');

router.get('/', auth.authCheck, redirect.showIndexPage);

router.post('/login', users.connect);
router.get('/login', redirect.showLoginPage);
router.get('/logout', users.disconnect);

router.get('/signup', redirect.showSignUpPage);


module.exports = router;