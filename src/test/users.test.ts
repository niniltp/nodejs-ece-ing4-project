import {expect} from 'chai'
import {Leveldb} from "../leveldb"
import {UserHandler, Users} from "../users";

const dbPath: string = './db/test/users';
var dbUser: UserHandler;

const bcrypt = require('bcryptjs');

describe('Users', function () {
    before(function () {
        Leveldb.clear(dbPath);
        dbUser = new UserHandler(dbPath)
    });

    describe('#get', function () {
        it('should get error', function (done) {
            dbUser.get("0", function (err: Error | null, result?: Users) {
                expect(err).to.not.be.null;
                expect(result).to.be.undefined;
                done()
            })
        });

        it('should save and get one', function (done) {
            const username: string = 'johny';
            const email: string = 'john@gamil.com';
            const password: string = 'secret';

            let user: Users = new Users(username, email, password);

            dbUser.save(user, function (err: Error | null, result?: Users[]) {
                dbUser.get('johny', function (err: Error | null, result?: Users) {
                    expect(err).to.be.null;
                    expect(result).to.not.be.undefined;
                    expect(result).to.include({
                        username: username,
                        email: email
                    });

                    if (result) {
                        bcrypt.compare(password, result.getPassword()).then((isMatch) => {
                            expect(isMatch).to.be.true
                        })
                    }
                    done()
                });
            })
        })
    });

    it('should save and get all', function (done) {
        let user1: Users = new Users('jerry', 'jerry@gamil.com', 'soso');
        let user2: Users = new Users('jane', 'janedoe@outlook.fr', 'imajane');

        let users: Users[] = [];
        users.push(user1);
        users.push(user2);

        dbUser.save(user1, function (err: Error | null) {
            dbUser.save(user2, function (err: Error | null) {
                dbUser.getAll(function (err: Error | null, result?: Users[]) {
                    expect(err).to.be.null;
                    expect(result).to.not.be.undefined;
                    expect(result).to.deep.include.members(users);
                    done()
                })
            })
        })
    })
});

describe('#delete', function () {
    it('should delete the data', function (done) {
        const username = 'jade';
        const email = 'jade@outlook.fr';
        const password = 'jaderuby';

        let user: Users = new Users(username, email, password);

        dbUser.save(user, function (err: Error | null, result?: Users[]) {
            dbUser.delete(username, function (err: Error | null) {
                dbUser.get(username, function (err: Error | null, result?: Users) {
                    expect(err).to.not.be.null;
                    expect(result).to.be.undefined;
                    done()
                })
            })
        })
    });

    it('should not fail when data does not exist', function (done) {
        dbUser.delete('joe', function (err: Error | null) {
            expect(err).to.not.be.null;
            done()
        })
    })
});

after(function () {
    dbUser.closeDB()
});


