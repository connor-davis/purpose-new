const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const TrainingModel = require('../../models/training');

/**
 * @openapi
 * /api/v2/training:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a training
 *     tags: [Training]
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
 *         description: The training was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newTraining = new TrainingModel({
      ...body,
      user: request.user._id
    });

    await newTraining.save();

    return response.status(200).send('Ok');
  } catch (error) {
      console.log(error);
    return response
      .status(500)
      .json({
        message: 'Failed to create training.',
        reason: error,

      });
  }
});

module.exports = router;
