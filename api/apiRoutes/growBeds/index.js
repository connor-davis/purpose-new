const { Router } = require('express');
const router = Router();
const HarvestModel = require('../../models/harvest');
const GrowBedModel = require('../../models/growBed');

/**
 * @openapi
 * /api/v2/growBeds:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all grow beds
 *     tags: [Grow Beds]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the grow beds
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const growBeds = await GrowBedModel.find(
      request.user.userType !== 'admin'
        ? {}
        : { user: { $eq: request.user._id } }
    ).populate("user");
    const growBedsData = growBeds
      .map((growBed) => growBed.user.userGroup === request.user.userGroup && growBed.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });

    return response.status(200).json(growBedsData);
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve grow beds.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/growBeds/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a grow bed with its id
 *     tags: [Grow Beds]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The grow beds id
 *     responses:
 *       200:
 *         description: Returns the grow bed with the id
 *       404:
 *         description: Grow Bed not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const growBed = await GrowBedModel.findOne({ _id: { $eq: id } });

    if (!growBed)
      return response
        .status(404)
        .json({ message: 'Grow bed not found.', error: 'grow-bed-not-found' });
    else {
      const growBedData = growBed.toJSON();
      return response.status(200).json(growBedData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the grow bed.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use('/', require('./create'));
router.use('/', require('./edit'));
router.use('/', require('./delete'));

module.exports = router;
