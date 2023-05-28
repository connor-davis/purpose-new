const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportTraining } = require('../../utils/export');
const router = Router();

router.get('/:userId', exportTraining);

module.exports = router;
