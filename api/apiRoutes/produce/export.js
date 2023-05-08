const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportProduce } = require('../../utils/export');
const router = Router();

router.get('/', adminRoute, exportProduce);

module.exports = router;
