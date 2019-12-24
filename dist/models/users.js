"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var leveldb_1 = require("./leveldb");
var level_ws_1 = __importDefault(require("level-ws"));
var bcrypt = require('bcryptjs');
var saltRounds = 10;
var Users = /** @class */ (function () {
    function Users(username, email, password, passwordHashed) {
        if (passwordHashed === void 0) { passwordHashed = true; }
        this.password = "";
        this.username = username;
        this.email = email;
        if (passwordHashed) {
            this.setPassword(password);
        }
        else
            this.password = password;
    }
    Users.fromDb = function (username, value) {
        var _a = value.split(":"), password = _a[0], email = _a[1];
        return new Users(username, email, password, false);
    };
    Users.prototype.setPassword = function (toSet) {
        // Hash and set password
        var salt = bcrypt.genSaltSync(saltRounds);
        var hash = bcrypt.hashSync(toSet, salt);
        this.password = hash;
    };
    Users.prototype.getPassword = function () {
        return this.password;
    };
    Users.prototype.validatePassword = function (toValidate) {
        // return comparison with hashed password
        return bcrypt.compareSync(toValidate, this.password);
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
            callback(err);
        })
            .on('close', function () {
            callback(null, users);
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
    UserHandler.prototype.update = function (username, user, callback) {
        var stream = level_ws_1.default(this.db);
        this.db.put("user:" + user.username, user.getPassword() + ":" + user.email, function (err) {
            callback(err);
        });
        stream.end();
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
