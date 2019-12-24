import {Users} from "../models/users";
import {Leveldb} from "../models/leveldb";
import {expect} from "chai";

const chai = require('chai');
const chaiHttp = require('chai-http');

process.env.NODE_ENV = 'test';

const {app, closeServer, closeDBs} = require('../server');
chai.use(chaiHttp);

const {createFile} = require('../helpers/files');
const config = require('../helpers/_config');
const dbPath = config.dbPath[process.env.NODE_ENV];

describe('API', () => {
    describe('Users', () => {
        describe('/GET users', () => {
            it('should GET empty array of users', (done) => {
                chai.request(app)
                    .get('/users')
                    .end((err, res) => {
                        if (err) done(err);
                        chai.expect(res).to.have.status(200);
                        chai.expect(res).to.be.an('object');
                        chai.expect(res.body).to.be.an('array');
                        chai.expect(res.body.length).to.eql(0);
                        done();
                    });
            });
        });
        describe('/POST user', () => {
            it('should POST user', (done) => {
                const username: string = 'johny';
                const email: string = 'john@gamil.com';
                const password: string = 'secret';

                let user: Users = new Users(username, email, password, false);

                chai.request(app)
                    .post('/users')
                    .send(user)
                    .end((err, res) => {
                        if (err) done(err);

                        chai.expect(res).to.have.status(200);
                        done();
                    });
            });
        });
        describe('/DELETE/:username user', () => {
            it('should DELETE user by the given id', (done) => {
                const username: string = 'johny';
                const password = 'secret';
                const email: string = 'john@gamil.com';

                let user: Users = new Users(username, email, password, false);

                let agent = chai.request.agent(app);

                agent
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        chai.expect(res).to.have.status(200);

                        return agent
                            .delete('/users/' + username)
                            .end((err, res) => {
                                if (err) done(err);
                                chai.expect(err).to.be.null;
                                chai.expect(res).to.not.be.undefined;
                                chai.expect(res).to.be.a('object');
                                chai.expect(res).to.have.status(200);
                                done();
                            });
                    });
            });
        });
        describe('/POST login', () => {
            it('should not login user with wrong credentials', (done) => {
                const username: string = 'johny';
                const email: string = 'john@gamil.com';
                const password: string = 'wrong';

                let user: Users = new Users(username, email, password, false);
                let agent = chai.request.agent(app);

                agent
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        if (err) done(err);
                        chai.expect(res).to.have.status(401);
                        agent.close();
                        done();
                    });
            });
            it('should login user with right credentials', (done) => {
                const username: string = 'johny';
                const email: string = 'john@gamil.com';
                const password: string = 'secret';

                let user: Users = new Users(username, email, password, false);
                let agent = chai.request.agent(app);

                agent
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        if (err) done(err);
                        chai.expect(res).to.have.status(200);
                        agent.close();
                        done();
                    });
            });
        });
        describe('/UPDATE/:username user', () => {
            it('should UPDATE user of the given id', (done) => {
                const username: string = 'johny';
                const email: string = 'johny@gamil.com';
                const password = 'secret';

                const newEmail = 'jass@gmail.com';
                const newPassword = 'newsecret';

                let user: Users = new Users(username, email, password, false);
                let updatedUser: Users = new Users(username, newEmail, newPassword, false);

                let agent = chai.request.agent(app);

                agent
                    .post('/login')
                    .send(user)
                    .end((err, res) => {
                        chai.expect(res).to.have.status(200);

                        return agent.put('/users/' + username)
                            .send(updatedUser)
                            .end((err, res) => {
                                chai.expect(res).to.not.be.undefined;
                                chai.expect(res).to.have.status(200);
                                chai.expect(res.body).to.be.an('object');
                                chai.expect(res.body).to.be.have.property('username');
                                chai.expect(res.body).to.be.have.property('email');
                                chai.expect(res.body).to.be.have.property('password');
                                expect(res.body).to.not.include({
                                    username: username,
                                    email: email
                                });

                                chai.expect(res.body).to.include({
                                    username: username,
                                    email: newEmail
                                });
                                agent.close();
                                done();
                            })

                    })
            });
        });
        describe('/GET/:username user', () => {
            it('should GET user by the given id', (done) => {
                const username: string = 'johny';
                const newEmail = "jass@gmail.com";

                chai.request(app)
                    .get('/users/' + username)
                    .end((err, res) => {
                        if (err) done(err);
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

    after(() => {
        closeDBs();
        closeServer();
        Leveldb.clear(dbPath + '/metrics');
        Leveldb.clear(dbPath + '/users');
        // Leveldb.clear(dbPath + '/sessions');
        createFile(dbPath + '/metrics');
        createFile(dbPath + '/users');
        // createFile(dbPath + '/sessions');
    })
});
