const { Router } = require('express');
const router = Router();
const HarvestModel = require('../../models/harvest');
const GrowBedModel = require('../../models/growBed');

/**
 * @openapi
 * /api/v2/growBeds/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Grow Beds
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of grow beds
 *     tags: [Grow Beds]
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
 *         description: The grow bed with userId
 *     responses:
 *       200:
 *         description: Returns the page of grow beds
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const growBeds = await GrowBedModel.find(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    )
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .populate('user');
    const growBedsData = growBeds
      .map(
        (growBed) =>
          growBed.user.userGroup === request.user.userGroup && growBed.toJSON()
      )
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });
    const totalGrowBeds = growBedsData.length;
    const totalPages = Math.ceil(totalGrowBeds / limit);

    return response
      .status(200)
      .json({ data: growBedsData, totalGrowBeds, totalPages });
  } catch (error) {
      console.log(error);
    console.log(error);

    return response.status(500).json({
      message: 'Failed to retrieve paged grow beds.',
      reason: error,
    });
  }
});

module.exports = router;
