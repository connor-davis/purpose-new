const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const HarvestModel = require('../../models/harvest');

/**
 * @openapi
 * /api/v2/growBeds:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a grow bed
 *     tags: [Grow Beds]
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
 *         description: The grow bed was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newHarvest = new HarvestModel({
      ...body,
      user: request.user._id,
    });

    await newHarvest.save();

    return response.status(200).send('Ok');
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Failed to create harvests.',
      reason: error,
    });
  }
});

module.exports = router;
