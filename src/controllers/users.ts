import {UserHandler, Users} from "../models/users";

const config = require('../helpers/_config');

const dbPath = process.env.NODE_ENV === 'test' ? config.dbPath['test'] : config.dbPath['development'];
const dbUser: UserHandler = new UserHandler(dbPath + '/users');

/* User CRUD */
exports.create = (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, function (err: Error | null, result?: Users) {
        if (!err || result !== undefined) {
            let message = 'Username already exist ! Please use another username ';
            res.status(409).send(message);
        } else {
            let user = new Users(req.body.username, req.body.email, req.body.password);
            dbUser.save(user, function (err: Error | null) {
                if (err) next(err);
                else res.status(201).redirect('/');
            })
        }
    })
};

exports.getAll = (req: any, res: any) => {
    dbUser.getAll(function (err: Error | null, result?: Users[]) {
        if (err || result === undefined) {
            res.status(404).send("users not found")
        } else res.status(200).json(result);
    });
};

exports.getOne = (req: any, res: any) => {
    dbUser.get(req.params.username, function (err: Error | null, result?: Users) {
        if (err || result === undefined) {
            res.status(404).send("user not found")
        } else res.status(200).json(result);
        dbUser.closeDB();
    })
};

exports.update = (req: any, res: any) => {
    if (req.params.username !== req.body.username) res.status(409).send("username does not match with param");
    else {
        dbUser.get(req.params.username, function (err: Error | null, result?: Users) {
            if (!err && result !== undefined && result !== null) {
                let user = new Users(req.body.username, req.body.email, req.body.password);
                dbUser.update(req.params.username, user, (err: Error | null) => {
                    if (err) throw err;
                    res.status(200).json(req.body);
                });
            } else {
                res.status(409).send("User does not exist");
            }
        })
    }
};

exports.delete = (req: any, res: any) => {
    const dbUser: UserHandler = new UserHandler('./db/users');
    dbUser.delete(req.params.username, (err: Error | null) => {
        if (err) {
            res.status(404).send("User not found");
        } else {
            res.status(200).send("Delete successful !");
        }
    })
};

/* User Authentication */

exports.connect = (req: any, res: any, next: any) => {
    dbUser.get(req.body.username, (err: Error | null, result?: Users) => {
        // if (err) next(err);

        if (result === undefined || !result.validatePassword(req.body.password)) {
            // res.redirect('/login');
            let message = " ";
            message = 'Wrong username or wrong password, please try again ';
            res.render('login', {message: message});
        } else {
            req.session.loggedIn = true;
            req.session.user = result;
            res.redirect('/')
        }
    })
};

exports.disconnect = (req: any, res: any, next: any) => {
    delete req.session.loggedIn;
    delete req.session.user;
    res.redirect('/login')
};

exports.closeDB = () => {
    dbUser.closeDB();
};