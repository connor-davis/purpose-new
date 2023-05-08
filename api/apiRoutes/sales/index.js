const { Router } = require('express');
const router = Router();
const SaleModel = require('../../models/sale');

/**
 * @openapi
 * /api/v2/sales:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all sales
 *     tags: [Sales]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the sales
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const sales = await SaleModel.find(
      request.user.userType !== 'admin'
        ? {}
        : { user: { $eq: request.user._id } }
    );
    const salesData = sales
      .map((sale) => sale.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });

    return response.status(200).json(salesData);
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve sales.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/sales/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a sale with its id
 *     tags: [Sales]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The sales id
 *     responses:
 *       200:
 *         description: Returns the sale with the id
 *       404:
 *         description: Sale not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const sale = await SaleModel.findOne({ _id: { $eq: id } });

    if (!sale)
      return response
        .status(404)
        .json({ message: 'Sale not found.', error: 'sale-not-found' });
    else {
      const saleData = sale.toJSON();
      return response.status(200).json(saleData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the sale.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use('/', require('./create'));
router.use('/', require('./edit'));
router.use('/', require('./delete'));

module.exports = router;
