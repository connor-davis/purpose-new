const { Router } = require('express');
const router = Router();
const SaleModel = require('../../models/sale');

/**
 * @openapi
 * /api/v2/sales/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Sales
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of sales
 *     tags: [Sales]
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
 *         description: The sale with userId
 *     responses:
 *       200:
 *         description: Returns the page of sales
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const sales = await SaleModel.find(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    )
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit).populate("user");
    const salesData = sales
      .map((sale) => sale.user.userGroup === request.user.userGroup && sale.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });
    const totalSales = salesData.length;
    const totalPages = Math.ceil(totalSales / limit);

    return response
      .status(200)
      .json({ data: salesData, totalSales, totalPages });
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve paged sales.',
      reason: error,
    });
  }
});

module.exports = router;
