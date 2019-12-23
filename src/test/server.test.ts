import {Users} from "../models/users";
const  chai = require('chai');
const  chaiHttp = require('chai-http');
import {Leveldb} from "../models/leveldb";

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

                let user: Users = new Users(username, email, password);

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
        describe('/GET/:username user', () => {
            it('should return GET user by the given id', (done) => {
                const username: string = 'johny';
                const email: string = 'john@gamil.com';

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
                            email: email
                        });

                        done();
                    });
            });
        });
        describe('/DELETE/:username user', () => {
            it('should DELETE user by the given id', (done) => {
                const username: string = 'johny';
                const email: string = 'john@gamil.com';

                chai.request(app)
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

    after(() => {
        closeDBs();
        closeServer();
        Leveldb.clear(dbPath + '/metrics');
        Leveldb.clear(dbPath + '/users');
        createFile(dbPath + '/metrics');
        createFile(dbPath + '/users');
    })
});