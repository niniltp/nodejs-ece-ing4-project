import {Leveldb} from './leveldb';

const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';

export class Users {
    public username: string;
    public email: string;
    private password: string = "";

    constructor(username: string, email: string, password: string, passwordHashed: boolean = true) {
        this.username = username;
        this.email = email;
        if (passwordHashed) {
            this.setPassword(password)
        } else this.password = password
    }

    static fromDb(username: string, value: any): Users {
        const [password, email] = value.split(":");
        return new Users(username, email, password)
    }

    public setPassword(toSet: string): void {
        // Hash and set password
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(toSet, salt);
        this.password = hash;
    }

    public getPassword(): string {
        return this.password
    }

    public validatePassword(toValidate: String): boolean {
        // return comparison with hashed password
        return bcrypt.compareSync(toValidate, this.password)
    }
}

export class UserHandler {
    public db: any;

    constructor(path: string) {
        this.db = Leveldb.open(path)
    }

    public closeDB() {
        this.db.close();
    }

    public getAll(callback: (err: Error | null, result?: Users[]) => void) {
        let users: Users[] = [];
        const rs = this.db.createReadStream()
            .on('data', function (data) {
                let username: string = data.key.split(':')[1];
                users.push(Users.fromDb(username, data.value));
            })
            .on('error', function (err) {
                console.log('Oh my!', err);
                callback(err);
            })
            .on('close', function () {
                console.log('Stream closed');
                callback(null, users);
            })
            .on('end', function () {
                console.log('Stream ended')
            });
    }

    public get(username: string, callback: (err: Error | null, result?: Users) => void) {
        this.db.get(`user:${username}`, function (err: Error, data: any) {
            if (err) callback(err);
            else if (data === undefined) callback(null, data);
            else callback(null, Users.fromDb(username, data));
        })
    }

    public save(
        user: Users,
        callback: (err: Error | null) => void) {
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
            callback(err)
        })
    }

    public delete(username: string, callback: (err: Error | null) => void) {
        let key: string = `user:${username}`;
        this.db.del(key, function (err) {
            callback(err);
        });
    }
}