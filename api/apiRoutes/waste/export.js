const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportWaste } = require('../../utils/export');
const router = Router();

router.get('/:userId', exportWaste);

module.exports = router;
