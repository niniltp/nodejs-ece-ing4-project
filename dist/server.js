"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var session = require("express-session");
var levelSession = require("level-session-store");
var body_parser_1 = __importDefault(require("body-parser"));
var app = express();
var port = process.env.PORT || '8081';
var LevelStore = levelSession(session);
var createFile = require('./helpers/files').createFile;
var config = require('./helpers/_config');
var _a = require('./routes/authentication'), authRouter = _a.authRouter, closeUserAuthDB = _a.closeUserAuthDB;
var _b = require('./routes/users'), usersRouter = _b.usersRouter, closeUserDB = _b.closeUserDB;
var _c = require('./routes/metrics'), metricsRouter = _c.metricsRouter, closeMetricDB = _c.closeMetricDB;
/* VIEW ENGINE EJS */
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');
var dbPath = process.env.NODE_ENV === 'test' ? config.dbPath['test'] : config.dbPath['development'];
createFile(dbPath);
usersRouter.use("/:username/metrics", metricsRouter);
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
app.use(session({
    secret: 'super secret phrase',
    store: new LevelStore(dbPath + '/sessions'),
    resave: true,
    saveUninitialized: true
}));
app.use("/", authRouter);
app.use("/users", usersRouter);
/* SERVER LISTENING */
var server = app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
var closeDBs = function () {
    closeMetricDB();
    closeUserDB();
    closeUserAuthDB();
};
var closeServer = function () {
    closeDBs();
    server.close();
};
module.exports = {
    app: app, closeServer: closeServer, closeDBs: closeDBs
};
