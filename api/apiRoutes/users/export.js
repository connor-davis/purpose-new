const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportUsers } = require('../../utils/export');
const router = Router();

router.get('/', adminRoute, exportUsers);

module.exports = router;
