import express = require('express');

const router = express.Router();
const user = require('../controllers/users');

router.post('/', user.create);
router.get('/', user.getAll);
router.get('/:username', user.getOne);
router.delete('/:username', user.delete);

module.exports = router;