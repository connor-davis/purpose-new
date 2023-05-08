const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportHarvests } = require('../../utils/export');
const router = Router();

router.get('/', adminRoute, exportHarvests);

module.exports = router;
