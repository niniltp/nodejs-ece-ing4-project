import {Metric, MetricsHandler} from '../src/models/metrics';
import {UserHandler, Users} from "../src/models/users";
import {Leveldb} from "../src/models/leveldb";

const config = require('../src/helpers/_config');
const {createFile} = require('../src/helpers/files');
const {getRandomInt} = require('../src/helpers/random');

const dbPath = config.dbPath['development'];
Leveldb.clear(dbPath);
createFile(dbPath);

/* Populate DB */
const dbUser = new UserHandler('./db/users');
const dbMet = new MetricsHandler('./db/metrics');

const users = [
    new Users("jane", "janedoe@gmail.com", "janedd"),
    new Users("jack", "jackpearson@gmail.com", "jacky")
];

users.forEach(user => {
    // Save user
    dbUser.save(user, (err: Error | null) => {
        if (err) throw err;
        console.log('POPULATE - User ' + user.username + '  added');
    });

    // Save random metrics
    const metrics = [
        new Metric(`${new Date().getTime() + getRandomInt(100)}`, getRandomInt(100)),
        new Metric(`${new Date().getTime() + getRandomInt(100)}`, getRandomInt(100)),
        new Metric(`${new Date().getTime() + getRandomInt(100)}`, getRandomInt(100)),
    ];

    dbMet.save(user.username, metrics, (err: Error | null) => {
        if (err) throw err;
    });
});