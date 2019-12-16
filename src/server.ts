import express = require('express');
import session = require('express-session');
import levelSession = require('level-session-store');
import bodyparser from "body-parser";

const app = express();
const port: string = process.env.PORT || '8081';
const LevelStore = levelSession(session);

const authRouter = require('./routes/authentication');
const usersRouter = require('./routes/users');
const metricsRouter = require('./routes/metrics');

/* VIEW ENGINE EJS */
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');

usersRouter.use("/:username/metrics", metricsRouter);

app.use(bodyparser.json());
app.use(bodyparser.urlencoded());
app.use(session({
    secret: 'super secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
app.use("/", authRouter);
app.use("/users", usersRouter);

/* SERVER LISTENING */
app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});