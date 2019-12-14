"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// importing modules
var express = require("express");
/* SESSION */
var session = require("express-session");
var levelSession = require("level-session-store");
var body_parser_1 = __importDefault(require("body-parser"));
/* METRICS HANDLER */
var metrics_1 = require("./metrics");
/* USERS HANDLER*/
var users_1 = require("./users");
/* EXPRESS */
var app = express();
var port = process.env.PORT || '8081';
/* VIEW ENGINE EJS */
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');
/* MIDDLEWARES body-parser */
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded());
/* SERVER LISTENING */
app.listen(port, function (err) {
    if (err) {
        throw err;
    }
    console.log("server is listening on port " + port);
});
/* SESSION */
var LevelStore = levelSession(session);
app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));
/* USER AUTHENTICATION */
var dbUser = new users_1.UserHandler('./db/users');
var authRouter = express.Router();
// Show page to log in
authRouter.get('/login', function (req, res) {
    res.render('login');
});
// Show page to sign up
authRouter.get('/signup', function (req, res) {
    res.render('signup');
});
// Logout a user
authRouter.get('/logout', function (req, res) {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login');
});
// Connect a user
authRouter.post('/login', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (err)
            next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login');
        }
        else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/');
        }
    });
});
app.use(authRouter);
/* USER AUTHORIZATION MIDDLEWARE */
// Check if user logged in
var authCheck = function (req, res, next) {
    if (req.session.loggedIn) {
        next();
    }
    else
        res.redirect('/login');
};
// Show index only if user logged in
app.get('/', authCheck, function (req, res) {
    res.render('index', { name: req.session.user.username });
});
/* USERS CRUD */
var userRouter = express.Router();
// Create a user
userRouter.post('/', function (req, res, next) {
    dbUser.get(req.body.username, function (err, result) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists");
        }
        else {
            var user = new users_1.Users(req.body.username, req.body.email, req.body.password);
            dbUser.save(user, function (err) {
                if (err)
                    next(err);
                else
                    res.status(201).redirect('/');
            });
        }
    });
});
// Get all users
userRouter.get('/', function (req, res, next) {
    dbUser.getAll(function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("users not found");
        }
        else
            res.status(200).json(result);
    });
});
// Get a user
userRouter.get('/:username', function (req, res, next) {
    dbUser.get(req.params.username, function (err, result) {
        if (err || result === undefined) {
            res.status(404).send("user not found");
        }
        else
            res.status(200).json(result);
    });
});
// Delete a user
userRouter.delete('/:username', function (req, res) {
    dbUser.delete(req.params.username, function (err) {
        if (err) {
            res.status(404).send("User not found");
            printLog("ERROR", "delete user");
        }
        else {
            res.status(200).send("Delete successful !");
            printLog("INFO", "delete user");
        }
    });
});
/* METRICS CRUD */
var metricsRouter = express.Router({ mergeParams: true });
var dbMet = new metrics_1.MetricsHandler('./db/metrics');
// Create a metric
metricsRouter.post('/', authCheck, function (req, res) {
    dbMet.save(req.params.username, req.body, function (err) {
        if (err)
            throw err;
        printLog("INFO", "saved");
        res.status(200).send("ok");
    });
});
// Get metrics of a user
metricsRouter.get('/', authCheck, function (req, res) {
    dbMet.get(req.params.username, null, function (err, result) {
        if (err)
            throw err;
        console.log("get");
        res.status(200).send(result);
    });
});
// Get one metric of a user
metricsRouter.get('/:metricId', authCheck, function (req, res) {
    dbMet.get(req.params.username, req.params.metricId, function (err, result) {
        if (err)
            throw err;
        console.log("getById");
        res.status(200).send(result);
    });
});
// Delete a metric
metricsRouter.delete('/:metricId', authCheck, function (req, res) {
    dbMet.delete(req.params.username, req.params.metricId, function (err) {
        if (err)
            throw err;
        console.log("deleteByTimestamp");
        res.status(200).send("Delete successful !");
    });
});
userRouter.use('/:username/metrics', metricsRouter);
app.use('/users', userRouter);
/* UTILS */
function printLog(type, msg) {
    // INFO, WARN, ERROR, DEBUG
    console.log("[" + new Date().toString() + "] " + type.toUpperCase() + " - " + msg);
}
