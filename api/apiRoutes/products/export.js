const { Router } = require('express');
const adminRoute = require('../../utils/adminRoute');
const { exportProducts } = require('../../utils/export');
const router = Router();

router.get('/:userId', exportProducts);

module.exports = router;
