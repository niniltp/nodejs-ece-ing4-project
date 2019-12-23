"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var metricsRouter = express.Router({ mergeParams: true });
var metric = require('../controllers/metrics');
var auth = require('../helpers/authentication');
metricsRouter.post('/', auth.authCheck, metric.create);
metricsRouter.get('/', auth.authCheck, metric.getAll);
metricsRouter.get('/:metricId', auth.authCheck, metric.getOne);
metricsRouter.put('/:metricId', auth.authCheck, metric.update);
metricsRouter.delete('/:metricId', auth.authCheck, metric.delete);
var closeMetricDB = function () {
    metric.closeDB();
};
module.exports = { metricsRouter: metricsRouter, closeMetricDB: closeMetricDB };
