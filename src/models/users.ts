import {Leveldb} from './leveldb';
import WriteStream from "level-ws";
import {Metric} from "./metrics";

const bcrypt = require('bcryptjs');
const saltRounds = 10;

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
        return new Users(username, email, password, false)
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
        return bcrypt.compareSync(toValidate, this.password);
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
                callback(err);
            })
            .on('close', function () {
                callback(null, users);
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

    public update(
        username: string,
        user: Users,
        callback: (error: Error | null) => void) {
        const stream = WriteStream(this.db);
        this.db.put(`user:${user.username}`, `${user.getPassword()}:${user.email}`, (err: Error | null) => {
            callback(err)
        });
        stream.end()
    }

    public delete(username: string, callback: (err: Error | null) => void) {
        let key: string = `user:${username}`;
        this.db.del(key, function (err) {
            callback(err);
        });
    }
}