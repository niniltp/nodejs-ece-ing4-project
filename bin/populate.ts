import { Metric, MetricsHandler } from '../src/metrics';
import {UserHandler, Users} from "../src/users";

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

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
        console.log('POPULATE - User ' + user.username +  '  added');
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