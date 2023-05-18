const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportSales } = require('../../utils/export');
const router = Router();

router.get('/:userId', exportSales);

module.exports = router;
