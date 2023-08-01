const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const SaleModel = require('../../models/sale');

/**
 * @openapi
 * /api/v2/sales:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a sale
 *     tags: [Sales]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The sale was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newSale = new SaleModel({
      ...body,
      user: request.user._id,
    });

    await newSale.save();

    return response.status(200).send('Ok');
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Failed to create sale.',
      reason: error,
    });
  }
});

module.exports = router;
