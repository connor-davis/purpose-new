const { Router } = require('express');
const router = Router();
const WasteModel = require('../../models/waste');

/**
 * @openapi
 * /api/v2/waste/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Waste
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of waste
 *     tags: [Waste]
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
 *         description: The waste with userId
 *     responses:
 *       200:
 *         description: Returns the page of waste
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const waste = await WasteModel.find(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    )
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .populate('user');
    const wasteData = waste
      .map((waste) => waste.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });
    const totalWaste = await WasteModel.countDocuments(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    );
    const totalPages = Math.ceil(totalWaste / limit);

    return response
      .status(200)
      .json({ data: wasteData, totalWaste, totalPages });
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve paged waste.',
      reason: error,
    });
  }
});

module.exports = router;
