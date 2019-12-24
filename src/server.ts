import express = require('express');
import session = require('express-session');
import levelSession = require('level-session-store');
import bodyparser from "body-parser";

const app = express();
const port: string = process.env.PORT || '8081';
const LevelStore = levelSession(session);

const {createFile} = require('./helpers/files');
const config = require('./helpers/_config');

const {authRouter, closeUserAuthDB} = require('./routes/authentication');
const {usersRouter, closeUserDB} = require('./routes/users');
const {metricsRouter, closeMetricDB} = require('./routes/metrics');

/* VIEW ENGINE EJS */
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');

const dbPath = process.env.NODE_ENV === 'test' ? config.dbPath['test'] : config.dbPath['development'];
createFile(dbPath);

usersRouter.use("/:username/metrics", metricsRouter);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(session({
    secret: 'super secret phrase',
    store: new LevelStore(dbPath + '/sessions'),
    resave: true,
    saveUninitialized: true
}));
app.use("/", authRouter);
app.use("/users", usersRouter);
/* Test Graphique */

/* SERVER LISTENING */
const server = app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});

const closeDBs = () => {
    closeMetricDB();
    closeUserDB();
    closeUserAuthDB();
};

const closeServer = () => {
    closeDBs();
    server.close();
};

module.exports = {
    app, closeServer, closeDBs
};