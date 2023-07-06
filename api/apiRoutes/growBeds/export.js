const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportHarvests } = require('../../utils/export');
const router = Router();

router.get('/:userId', exportHarvests);

module.exports = router;
