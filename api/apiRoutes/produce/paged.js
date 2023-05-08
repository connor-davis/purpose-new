const { Router } = require('express');
const router = Router();
const ProduceModel = require('../../models/produce');

/**
 * @openapi
 * /api/v2/produce/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Produce
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of produce
 *     tags: [Produce]
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
 *         description: The produce with userId
 *     responses:
 *       200:
 *         description: Returns the page of produce
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const produce = await ProduceModel.find(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    )
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit);
    const produceData = produce.map((produce) => produce.toJSON());
    const totalProduce = await ProduceModel.countDocuments(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    );
    const totalPages = Math.ceil(totalProduce / limit);

    return response
      .status(200)
      .json({ data: produceData, totalProduce, totalPages });
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve paged produce.',
      reason: error,
      
    });
  }
});

module.exports = router;
