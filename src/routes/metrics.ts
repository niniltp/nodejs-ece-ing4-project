import express = require('express');

const metricsRouter = express.Router({mergeParams: true});
const metric = require('../controllers/metrics');
const auth = require('../helpers/authentication');

metricsRouter.post('/', auth.authCheck, metric.create);
metricsRouter.get('/', auth.authCheck, metric.getAll);
metricsRouter.get('/:metricId', auth.authCheck, metric.getOne);
metricsRouter.put('/:metricId', auth.authCheck, metric.update);
metricsRouter.delete('/:metricId', auth.authCheck, metric.delete);

const closeMetricDB = () => {
    metric.closeDB();
};

module.exports = {metricsRouter, closeMetricDB};