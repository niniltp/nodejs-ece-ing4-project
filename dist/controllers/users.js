"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../models/users");
var config = require('../helpers/_config');
var dbPath = process.env.NODE_ENV === 'test' ? config.dbPath['test'] : config.dbPath['development'];
var dbUser = new users_1.UserHandler(dbPath + '/users');
/* User CRUD */
exports.create = function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            var message = 'Username already exist ! Please use another username ';
            res.status(409).send(message);
        }
        else {
            var user = new users_1.Users(req.body.username, req.body.email, req.body.password);
            dbUser.save(user, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).redirect('/');
            });
        }
    });
};
exports.getAll = function (req, res) {
    dbUser.getAll(function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("users not found");
        }
        else
            res.status(200).json(result);
    });
};
exports.getOne = function (req, res) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
        dbUser.closeDB();
    });
};
exports.update = function (req, res) {
    if (req.params.username !== req.body.username)
        res.status(409).send("username does not match with param");
    else {
        dbUser.get(req.params.username, function (err, result) {
            if (!err && result !== undefined && result !== null) {
                var user = new users_1.Users(req.body.username, req.body.email, req.body.password);
                dbUser.update(req.params.username, user, function (err) {
                    if (err)
                        throw err;
                    res.status(200).json(req.body);
                });
            }
            else {
                res.status(409).send("User does not exist");
            }
        });
    }
};
exports.delete = function (req, res) {
    var dbUser = new users_1.UserHandler('./db/users');
    dbUser.delete(req.params.username, function (err) {
        if (err) {
            res.status(404).send("User not found");
        }
        else {
            res.status(200).send("Delete successful !");
        }
    });
};
/* User Authentication */
exports.connect = function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        // if (err) next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            // res.redirect('/login');
            var message = " ";
            message = 'Wrong username or wrong password, please try again ';
            res.render('login', { message: message });
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
};
exports.disconnect = function (req, res, next) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
};
exports.closeDB = function () {
    dbUser.closeDB();
};
