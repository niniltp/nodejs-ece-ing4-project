// importing modules
import express = require('express');
/* SESSION */
import session = require('express-session');
import levelSession = require('level-session-store');
import bodyparser from "body-parser";
/* METRICS HANDLER */
import {Metric, MetricsHandler} from './metrics';
/* USERS HANDLER*/
import {UserHandler, Users} from './users';

/* EXPRESS */
const app = express();
const port: string = process.env.PORT || '8081';

/* VIEW ENGINE EJS */
app.set('views', __dirname + "/../view");
app.set('view engine', 'ejs');

/* MIDDLEWARES body-parser */
app.use(bodyparser.json());
app.use(bodyparser.urlencoded());

/* SERVER LISTENING */
app.listen(port, (err: Error) => {
    if (err) {
        throw err;
    }
    console.log(`server is listening on port ${port}`);
});

/* SESSION */
const LevelStore = levelSession(session);

app.use(session({
    secret: 'my very secret phrase',
    store: new LevelStore('./db/sessions'),
    resave: true,
    saveUninitialized: true
}));

/* USER AUTHENTICATION */
const dbUser: UserHandler = new UserHandler('./db/users');
const authRouter = express.Router();

// Show page to log in
authRouter.get('/login', (req: any, res: any) => {
    res.render('login')
});

// Show page to sign up
authRouter.get('/signup', (req: any, res: any) => {
    res.render('signup')
});

// Logout a user
authRouter.get('/logout', (req: any, res: any) => {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login')
});

// Connect a user
authRouter.post('/login', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: Users) => {
        if (err) next(err);
        if (result === undefined || !result.validatePassword(req.body.password)) {
            res.redirect('/login')
        } else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/')
        }
    })
});

app.use(authRouter);

/* USER AUTHORIZATION MIDDLEWARE */

// Check if user logged in
const authCheck = function (req: any, res: any, next: any) {
    if (req.session.loggedIn) {
        next();
    } else res.redirect('/login')
};

// Show index only if user logged in
app.get('/', authCheck, (req: any, res: any) => {
    res.render('index', {name: req.session.user.username})
});

/* Test Graphique */
// Show page for charts
authRouter.get('/graph', (req: any, res: any) => {
    res.render('graphTest')
});

/* USERS CRUD */
const userRouter = express.Router();

// Create a user
userRouter.post('/', (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: Users) {
        if (!err || result !== undefined) {
            res.status(409).send("user already exists")
        } else {
            let user = new Users(req.body.username, req.body.email, req.body.password);
            dbUser.save(user, function (err: Error | null) {
                if (err) next(err);
                else res.status(201).redirect('/');
            })
        }
    })
});

// Get all users
userRouter.get('/', (req: any, res: any, next: any) => {
    dbUser.getAll(function (err: Error | null, result?: Users[]) {
        if (err || result === undefined) {
            res.status(404).send("users not found")
        } else res.status(200).json(result)
    })
});

// Get a user
userRouter.get('/:username', (req: any, res: any, next: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: Users) {
        if (err || result === undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result)
    })
});

// Delete a user
userRouter.delete('/:username', (req: any, res: any) => {
    dbUser.delete(req.params.username, (err: Error | null) => {
        if (err) {
            res.status(404).send("User not found");
            printLog("ERROR", "delete user");
        } else {
            res.status(200).send("Delete successful !");
            printLog("INFO", "delete user");
        }
    })
});

/* METRICS CRUD */
const metricsRouter = express.Router({mergeParams: true});
const dbMet: MetricsHandler = new MetricsHandler('./db/metrics');

// Create a metric
metricsRouter.post('/', authCheck, (req: any, res: any) => {
    dbMet.save(req.params.username, req.body, (err: Error | null) => {
        if (err) throw err;
        printLog("INFO", "saved");
        res.status(200).send("ok")
    })
});

// Get metrics of a user
metricsRouter.get('/', authCheck, (req: any, res: any) => {
    dbMet.get(req.params.username, null, (err: Error | null, result?: Metric[] | null) => {
        if (err) throw err;
        console.log("get");
        res.status(200).send(result);
    })
});

// Get one metric of a user
metricsRouter.get('/:metricId', authCheck, (req: any, res: any) => {
    dbMet.get(req.params.username, req.params.metricId, (err: Error | null, result?: Metric[] | null) => {
        if (err) throw err;
        console.log("getById");
        res.status(200).send(result);
    })
});

// Delete a metric
metricsRouter.delete('/:metricId', authCheck, (req: any, res: any) => {
    dbMet.delete(req.params.username, req.params.metricId, (err: Error | null) => {
        if (err) throw err;
        console.log("deleteByTimestamp");
        res.status(200).send("Delete successful !");
    })
});

userRouter.use('/:username/metrics', metricsRouter);
app.use('/users', userRouter);

/* UTILS */
function printLog(type: string, msg: string) {
    // INFO, WARN, ERROR, DEBUG
    console.log("[" + new Date().toString() + "] " + type.toUpperCase() + " - " + msg);
}