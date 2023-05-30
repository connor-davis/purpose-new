const { Router } = require('express');
const router = Router();
const TrainingModel = require('../../models/training');
const SaleModel = require('../../models/sale');

/**
 * @openapi
 * /api/v2/training:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all training
 *     tags: [Training]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the training
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const training = await TrainingModel.find(
      request.user.userType !== 'admin'
        ? {}
        : { user: { $eq: request.user._id } }
    );
    const trainingData = training
      .map((training) => training.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });

    return response.status(200).json(trainingData);
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve training.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/waste/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a waste with its id
 *     tags: [Waste]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The wastes id
 *     responses:
 *       200:
 *         description: Returns the waste with the id
 *       404:
 *         description: Waste not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const waste = await TrainingModel.findOne({ _id: { $eq: id } });

    if (!waste)
      return response
        .status(404)
        .json({ message: 'Waste not found.', error: 'waste-not-found' });
    else {
      const wasteData = waste.toJSON();
      return response.status(200).json(wasteData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the waste.',
      reason: error,
    });
  }
});

router.use('/attendees/search', require('./attendees'));
router.use('/page', require('./paged'));
router.use('/', require('./create'));
router.use('/', require('./edit'));
router.use('/', require('./delete'));

module.exports = router;
