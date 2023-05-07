const { Router } = require('express');
const router = Router();
const HarvestModel = require('../../models/harvest');

/**
 * @openapi
 * /api/v2/harvests:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all harvests
 *     tags: [Harvests]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the harvests
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const harvests = await HarvestModel.find(
      request.user.userType !== 'admin'
        ? {}
        : { _userId: { $eq: request.user._id } }
    );
    const harvestsData = harvests
      .map((harvest) => harvest.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });

    return response.status(200).json(harvestsData);
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve harvests.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/harvests/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a harvest with its id
 *     tags: [Harvests]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The harvests id
 *     responses:
 *       200:
 *         description: Returns the harvest with the id
 *       404:
 *         description: Harvest not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const harvest = await HarvestModel.findOne({ _id: { $eq: id } });

    if (!harvest)
      return response
        .status(404)
        .json({ message: 'Harvest not found.', error: 'harvest-not-found' });
    else {
      const harvestData = harvest.toJSON();
      return response.status(200).json(harvestData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the harvest.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use('/', require('./create'));
router.use('/', require('./edit'));
router.use('/', require('./delete'));

module.exports = router;
