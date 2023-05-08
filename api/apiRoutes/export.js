const { Router } = require('express');
const adminRoute = require('../utils/adminRoute');
const router = Router();

router.get('/', adminRoute, async (request, response) => {
  response.status(200).send('Ok');
});

module.exports = router;
