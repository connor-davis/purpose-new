const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const WasteModel = require('../../models/waste');

/**
 * @openapi
 * /api/v2/waste:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a waste
 *     tags: [Waste]
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
 *         description: The waste was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newSale = new WasteModel({
      ...body,
      user: request.user._id
    });

    await newSale.save();

    return response.status(200).send('Ok');
  } catch (error) {
      console.log(error);
    return response
      .status(500)
      .json({
        message: 'Failed to create waste.',
        reason: error,

      });
  }
});

module.exports = router;
