"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metricsRouter = express.Router({ mergeParams: true });
var metric = require('../controllers/metrics');
var auth = require('../helpers/authentication');
metricsRouter.post('/', auth.usernameCheck, metric.create);
metricsRouter.get('/', auth.usernameCheck, metric.getAll);
metricsRouter.get('/:metricId', auth.usernameCheck, metric.getOne);
metricsRouter.put('/:metricId', auth.usernameCheck, metric.update);
metricsRouter.delete('/:metricId', auth.usernameCheck, metric.delete);
var closeMetricDB = function () {
    metric.closeDB();
};
module.exports = { metricsRouter: metricsRouter, closeMetricDB: closeMetricDB };
