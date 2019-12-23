"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var chai_1 = require("chai");
var leveldb_1 = require("../models/leveldb");
var users_1 = require("../models/users");
var createFile = require('../helpers/files').createFile;
var dbPath = './db_test_users';
createFile(dbPath);
var dbUser;
var bcrypt = require('bcryptjs');
describe('Users', function () {
    before(function () {
        leveldb_1.Leveldb.clear(dbPath);
        dbUser = new users_1.UserHandler(dbPath);
    });
    describe('#get', function () {
        it('should get error for no matched user found', function (done) {
            dbUser.get("0", function (err, result) {
                chai_1.expect(err).to.not.be.null;
                chai_1.expect(result).to.be.undefined;
                done();
            });
        });
        it('should save and get one', function (done) {
            var username = 'johny';
            var email = 'john@gamil.com';
            var password = 'secret';
            var user = new users_1.Users(username, email, password);
            dbUser.save(user, function (err, result) {
                dbUser.get('johny', function (err, result) {
                    chai_1.expect(err).to.be.null;
                    chai_1.expect(result).to.not.be.undefined;
                    chai_1.expect(result).to.include({
                        username: username,
                        email: email
                    });
                    if (result) {
                        bcrypt.compare(password, result.getPassword()).then(function (isMatch) {
                            chai_1.expect(isMatch).to.be.true;
                        });
                    }
                });
                done();
            });
        });
        it('should save and get all', function (done) {
            var user1 = new users_1.Users('jerry', 'jerry@gamil.com', 'soso');
            var user2 = new users_1.Users('jane', 'janedoe@outlook.fr', 'imajane');
            var users = [];
            users.push(user1);
            users.push(user2);
            dbUser.save(user1, function (err) {
                dbUser.save(user2, function (err) {
                    dbUser.getAll(function (err, result) {
                        chai_1.expect(err).to.be.null;
                        chai_1.expect(result).to.not.be.undefined;
                        chai_1.expect(result).to.deep.include.members(users);
                        done();
                    });
                });
            });
        });
    });
    describe('#update', function () {
        it('should update the data', function (done) {
            var username = 'joker';
            var email = 'jjoker@outlook.fr';
            var newEmail = "joker@gmail.com";
            var password = 'notjoking';
            var newPassword = 'joking';
            var user = new users_1.Users(username, email, password);
            var updatedUser = new users_1.Users(username, newEmail, newPassword);
            dbUser.save(user, function (err, result) {
                dbUser.update(username, updatedUser, function (err, result) {
                    dbUser.get(username, function (err, result) {
                        chai_1.expect(err).to.be.null;
                        chai_1.expect(result).to.not.be.undefined;
                        chai_1.expect(result).to.not.include({
                            username: username,
                            email: email
                        });
                        chai_1.expect(result).to.include({
                            username: username,
                            email: newEmail
                        });
                        /* Check password */
                        if (result) {
                            bcrypt.compare(password, result.getPassword()).then(function (isMatch) {
                                chai_1.expect(isMatch).to.be.false;
                            });
                            bcrypt.compare(newPassword, result.getPassword()).then(function (isMatch) {
                                chai_1.expect(isMatch).to.be.true;
                            });
                        }
                        done();
                    });
                });
            });
        });
    });
    describe('#delete', function () {
        it('should delete the data', function (done) {
            var username = 'jade';
            var email = 'jade@outlook.fr';
            var password = 'jaderuby';
            var user = new users_1.Users(username, email, password);
            dbUser.save(user, function (err, result) {
                dbUser.delete(username, function (err) {
                    dbUser.get(username, function (err, result) {
                        chai_1.expect(err).to.not.be.null;
                        chai_1.expect(result).to.be.undefined;
                        done();
                    });
                });
            });
        });
        it('should not fail when data does not exist', function (done) {
            dbUser.delete('joe', function (err) {
                chai_1.expect(err).to.not.be.null;
                done();
            });
        });
    });
    after(function () {
        dbUser.closeDB();
    });
});
