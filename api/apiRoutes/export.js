const { Router } = require('express');
const adminRoute = require('../utils/adminRoute');
const { exportAllData } = require('../utils/export');
const router = Router();

router.get('/', adminRoute, exportAllData);

module.exports = router;
