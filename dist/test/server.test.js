"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var users_1 = require("../models/users");
var leveldb_1 = require("../models/leveldb");
var chai_1 = require("chai");
var chai = require('chai');
var chaiHttp = require('chai-http');
process.env.NODE_ENV = 'test';
var _a = require('../server'), app = _a.app, closeServer = _a.closeServer, closeDBs = _a.closeDBs;
chai.use(chaiHttp);
var createFile = require('../helpers/files').createFile;
var config = require('../helpers/_config');
var dbPath = config.dbPath[process.env.NODE_ENV];
describe('API', function () {
    describe('Users', function () {
        describe('/GET users', function () {
            it('should GET empty array of users', function (done) {
                chai.request(app)
                    .get('/users')
                    .end(function (err, res) {
                    if (err)
                        done(err);
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.be.an('object');
                    chai.expect(res.body).to.be.an('array');
                    chai.expect(res.body.length).to.eql(0);
                    done();
                });
            });
        });
        describe('/POST user', function () {
            it('should POST user', function (done) {
                var username = 'johny';
                var email = 'john@gamil.com';
                var password = 'secret';
                var user = new users_1.Users(username, email, password, false);
                chai.request(app)
                    .post('/users')
                    .send(user)
                    .end(function (err, res) {
                    if (err)
                        done(err);
                    chai.expect(res).to.have.status(200);
                    done();
                });
            });
        });
        describe('/DELETE/:username user', function () {
            it('should DELETE user by the given id', function (done) {
                var username = 'johny';
                var password = 'secret';
                var email = 'john@gamil.com';
                var user = new users_1.Users(username, email, password, false);
                var agent = chai.request.agent(app);
                agent
                    .post('/login')
                    .send(user)
                    .end(function (err, res) {
                    chai.expect(res).to.have.status(200);
                    return agent
                        .delete('/users/' + username)
                        .end(function (err, res) {
                        if (err)
                            done(err);
                        chai.expect(err).to.be.null;
                        chai.expect(res).to.not.be.undefined;
                        chai.expect(res).to.be.a('object');
                        chai.expect(res).to.have.status(200);
                        done();
                    });
                });
            });
        });
        describe('/POST login', function () {
            it('should not login user with wrong credentials', function (done) {
                var username = 'johny';
                var email = 'john@gamil.com';
                var password = 'wrong';
                var user = new users_1.Users(username, email, password, false);
                var agent = chai.request.agent(app);
                agent
                    .post('/login')
                    .send(user)
                    .end(function (err, res) {
                    if (err)
                        done(err);
                    chai.expect(res).to.have.status(401);
                    agent.close();
                    done();
                });
            });
            it('should login user with right credentials', function (done) {
                var username = 'johny';
                var email = 'john@gamil.com';
                var password = 'secret';
                var user = new users_1.Users(username, email, password, false);
                var agent = chai.request.agent(app);
                agent
                    .post('/login')
                    .send(user)
                    .end(function (err, res) {
                    if (err)
                        done(err);
                    chai.expect(res).to.have.status(200);
                    agent.close();
                    done();
                });
            });
        });
        describe('/UPDATE/:username user', function () {
            it('should UPDATE user of the given id', function (done) {
                var username = 'johny';
                var email = 'johny@gamil.com';
                var password = 'secret';
                var newEmail = 'jass@gmail.com';
                var newPassword = 'newsecret';
                var user = new users_1.Users(username, email, password, false);
                var updatedUser = new users_1.Users(username, newEmail, newPassword, false);
                var agent = chai.request.agent(app);
                agent
                    .post('/login')
                    .send(user)
                    .end(function (err, res) {
                    chai.expect(res).to.have.status(200);
                    return agent.put('/users/' + username)
                        .send(updatedUser)
                        .end(function (err, res) {
                        chai.expect(res).to.not.be.undefined;
                        chai.expect(res).to.have.status(200);
                        chai.expect(res.body).to.be.an('object');
                        chai.expect(res.body).to.be.have.property('username');
                        chai.expect(res.body).to.be.have.property('email');
                        chai.expect(res.body).to.be.have.property('password');
                        chai_1.expect(res.body).to.not.include({
                            username: username,
                            email: email
                        });
                        chai.expect(res.body).to.include({
                            username: username,
                            email: newEmail
                        });
                        agent.close();
                        done();
                    });
                });
            });
        });
        describe('/GET/:username user', function () {
            it('should GET user by the given id', function (done) {
                var username = 'johny';
                var newEmail = "jass@gmail.com";
                chai.request(app)
                    .get('/users/' + username)
                    .end(function (err, res) {
                    if (err)
                        done(err);
                    chai.expect(err).to.be.null;
                    chai.expect(res).to.not.be.undefined;
                    chai.expect(res).to.have.status(200);
                    chai.expect(res).to.be.an('object');
                    chai.expect(res.body).to.be.an('object');
                    chai.expect(res.body).to.be.have.property('username');
                    chai.expect(res.body).to.be.have.property('email');
                    chai.expect(res.body).to.be.have.property('password');
                    chai.expect(res.body).to.include({
                        username: username,
                        email: newEmail
                    });
                    done();
                });
            });
        });
    });
    after(function () {
        closeDBs();
        closeServer();
        leveldb_1.Leveldb.clear(dbPath + '/metrics');
        leveldb_1.Leveldb.clear(dbPath + '/users');
        // Leveldb.clear(dbPath + '/sessions');
        createFile(dbPath + '/metrics');
        createFile(dbPath + '/users');
        // createFile(dbPath + '/sessions');
    });
});
