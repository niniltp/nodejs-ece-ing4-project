"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var metrics_1 = require("../models/metrics");
var config = require('../helpers/_config');
var dbPath = process.env.NODE_ENV === 'test' ? config.dbPath['test'] : config.dbPath['development'];
var dbMet = new metrics_1.MetricsHandler(dbPath + '/metrics');
/* Metric CRUD */
exports.create = function (req, res) {
    dbMet.save(req.params.username, req.body, function (err) {
        if (err)
            throw err;
        res.status(200).json(req.body);
    });
};
exports.getAll = function (req, res) {
    dbMet.get(req.params.username, null, function (err, result) {
        if (err)
            throw err;
        res.status(200).send(result);
    });
};
exports.getOne = function (req, res) {
    dbMet.get(req.params.username, req.params.metricId, function (err, result) {
        if (err)
            throw err;
        res.status(200).send(result);
    });
};
exports.update = function (req, res) {
    console.log(req.params.metricId !== req.body.timestamp);
    console.log(req.body.timestamp);
    console.log(req.params.metricId);
    console.log(req.body);
    if (req.params.metricId !== req.body.timestamp)
        res.status(409).send("timestamp does not match with param metricId");
    else {
        dbMet.get(req.params.username, req.params.metricId, function (err, result) {
            if (err)
                throw err;
            if (!err && result !== undefined && result !== null && result.length === 1) {
                dbMet.update(req.params.username, req.params.metricId, req.body, function (err) {
                    if (err)
                        throw err;
                    res.status(200).json(req.body);
                });
            }
            else {
                res.status(409).send("Metric does not exist");
            }
        });
    }
};
exports.delete = function (req, res) {
    dbMet.delete(req.params.username, req.params.metricId, function (err) {
        if (err)
            throw err;
        res.status(200).send("Delete successful !");
    });
};
exports.closeDB = function () {
    dbMet.closeDB();
};
