const { Router } = require('express');
const router = Router();
const HarvestModel = require('../../models/harvest');

/**
 * @openapi
 * /api/v2/harvests/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Harvests
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of harvests
 *     tags: [Harvests]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *         required: true
 *         description: The page number
 *       - in: path
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *         required: true
 *         description: The page limit
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         allowEmptyValue: true
 *         description: The harvest with userId
 *     responses:
 *       200:
 *         description: Returns the page of harvests
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const harvests = await HarvestModel.find(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    )
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .populate('user');
    const harvestsData = harvests
      .map(
        (harvest) =>
          harvest.user.userGroup === request.user.userGroup && harvest.toJSON()
      )
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });
    const totalHarvests = harvestsData.length;
    const totalPages = Math.ceil(totalHarvests / limit);

    console.log(harvestsData, totalHarvests, totalPages);

    return response
      .status(200)
      .json({ data: harvestsData, totalHarvests, totalPages });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Failed to retrieve paged harvests.',
      reason: error,
    });
  }
});

module.exports = router;
