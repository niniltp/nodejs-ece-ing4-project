import express = require('express');

const metricsRouter = express.Router({mergeParams: true});
const metric = require('../controllers/metrics');
const auth = require('../helpers/authentication');

metricsRouter.post('/', auth.usernameCheck, metric.create);
metricsRouter.get('/', auth.usernameCheck, metric.getAll);
metricsRouter.get('/:metricId', auth.usernameCheck, metric.getOne);
metricsRouter.put('/:metricId', auth.usernameCheck, metric.update);
metricsRouter.delete('/:metricId', auth.usernameCheck, metric.delete);

const closeMetricDB = () => {
    metric.closeDB();
};

module.exports = {metricsRouter, closeMetricDB};