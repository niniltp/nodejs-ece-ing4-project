"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var encoding_down_1 = __importDefault(require("encoding-down"));
var leveldown_1 = __importDefault(require("leveldown"));
var levelup_1 = __importDefault(require("levelup"));
var fs = require("fs");
var del = require("del");
var Leveldb = /** @class */ (function () {
    function Leveldb() {
    }
    Leveldb.open = function (path) {
        var encoded = encoding_down_1.default(leveldown_1.default(path), { valueEncoding: 'json' });
        return levelup_1.default(encoded);
    };
    Leveldb.clear = function (path) {
        if (fs.existsSync(path)) {
            del.sync(path, { force: true });
        }
    };
    return Leveldb;
}());
exports.Leveldb = Leveldb;
