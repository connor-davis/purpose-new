const { Router } = require('express');
const router = Router();
const WasteModel = require('../../models/waste');

/**
 * @openapi
 * /api/v2/waste:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all waste
 *     tags: [Waste]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the waste
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const waste = await WasteModel.find(
      request.user.userType !== 'admin'
        ? {}
        : { user: { $eq: request.user._id } }
    );
    const wasteData = waste
      .map((waste) => waste.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });

    return response.status(200).json(wasteData);
  } catch (error) {
      console.log(error);
    return response.status(500).json({
      message: 'Failed to retrieve waste.',
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
    const waste = await WasteModel.findOne({ _id: { $eq: id } });

    if (!waste)
      return response
        .status(404)
        .json({ message: 'Waste not found.', error: 'waste-not-found' });
    else {
      const wasteData = waste.toJSON();
      return response.status(200).json(wasteData);
    }
  } catch (error) {
      console.log(error);
    return response.status(500).json({
      message: 'Failed to retrieve the waste.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use('/', require('./create'));
router.use('/', require('./edit'));
router.use('/', require('./delete'));

module.exports = router;
