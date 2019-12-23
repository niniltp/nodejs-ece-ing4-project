import * as del from "del";
import * as fs from "fs";

exports.clearFile = (path: string) => {
    if (fs.existsSync(path)) {
        del.sync(path, {force: true})
    }
};

exports.createFile = (path: string) => {
    if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
    }
};