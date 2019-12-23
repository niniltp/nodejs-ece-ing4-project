"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
var del = __importStar(require("del"));
var fs = __importStar(require("fs"));
exports.clearFile = function (path) {
    if (fs.existsSync(path)) {
        del.sync(path, { force: true });
    }
};
exports.createFile = function (path) {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};
