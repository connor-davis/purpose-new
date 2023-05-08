const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const ProduceModel = require('../../models/produce');

/**
 * @openapi
 * /api/v2/produce:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a produce
 *     tags: [Produce]
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
 *         description: The produce was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newProduce = new ProduceModel({
      ...body,
      user: request.user._id
    });

    await newProduce.save();

    return response.status(200).send('Ok');
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to create produce.',
        reason: error,
      });
  }
});

module.exports = router;
