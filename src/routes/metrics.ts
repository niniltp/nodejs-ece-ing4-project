import express = require('express');

const router = express.Router({mergeParams: true});
const metric = require('../controllers/metrics');
const auth = require('../helpers/authentication');

router.post('/', auth.authCheck, metric.create);
router.get('/', auth.authCheck, metric.getAll);
router.get('/:metricId', auth.authCheck, metric.getOne);
router.delete('/:metricId', auth.authCheck, metric.delete);

module.exports = router;