"use strict";
exports.showLoginPage = function (req, res) {
    var message = 'Welcome';
    res.render('login', { message: message });
};
exports.showIndexPage = function (req, res) {
    res.render('index', { name: req.session.user.username });
};
exports.showSignUpPage = function (req, res) {
    var message = 'Welcome';
    res.render('signup', { message: message });
};
