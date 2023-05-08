const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportSales } = require('../../utils/export');
const router = Router();

router.get('/', adminRoute, exportSales);

module.exports = router;
