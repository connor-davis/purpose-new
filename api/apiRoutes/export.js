const { Router } = require('express');
const { exportAllData } = require('../utils/export');
const router = Router();

router.get('/:userId', exportAllData);

module.exports = router;
