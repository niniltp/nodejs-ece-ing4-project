"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var Users = /** @class */ (function () {
    function Users(username, email, password, passwordHashed) {
        if (passwordHashed === void 0) { passwordHashed = false; }
        this.password = "";
        this.username = username;
        this.email = email;
        if (!passwordHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    Users.fromDb = function (username, value) {
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new Users(username, email, password);
    };
    Users.prototype.setPassword = function (toSet) {
        // Hash and set password
        this.password = toSet;

    };
    Users.prototype.getPassword = function () {
        return this.password;
    };
    Users.prototype.validatePassword = function (toValidate) {
        // return comparison with hashed password
        return this.password === toValidate;
    };
    return Users;
}());
exports.Users = Users;
var UserHandler = /** @class */ (function () {
    function UserHandler(path) {
        this.db = leveldb_1.Leveldb.open(path);
    }
    UserHandler.prototype.closeDB = function () {
        this.db.close();
    };
    UserHandler.prototype.getAll = function (callback) {
        var users = [];
        var rs = this.db.createReadStream()
            .on('data', function (data) {
            var username = data.key.split(':')[1];
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
            console.log('Stream ended');
        });
    };
    UserHandler.prototype.get = function (username, callback) {
        this.db.get("user:" + username, function (err, data) {
            if (err)
                callback(err);
            else if (data === undefined)
                callback(null, data);
            else
                callback(null, Users.fromDb(username, data));
        });
    };
    UserHandler.prototype.save = function (user, callback) {
        this.db.put("user:" + user.username, user.getPassword() + ":" + user.email, function (err) {
            callback(err);
        });
    };
    UserHandler.prototype.delete = function (username, callback) {
        var key = "user:" + username;
        this.db.del(key, function (err) {
            callback(err);
        });
    };
    return UserHandler;
}());
exports.UserHandler = UserHandler;
