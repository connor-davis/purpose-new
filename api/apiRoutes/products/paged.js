const { Router } = require('express');
const router = Router();
const ProductModel = require('../../models/product');

/**
 * @openapi
 * /api/v2/products/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Products
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of products
 *     tags: [Products]
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
 *         description: The product with userId
 *     responses:
 *       200:
 *         description: Returns the page of products
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const products = await ProductModel.find(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    )
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit).populate("user");
    const productsData = products.map((product) => product.user.userGroup === request.user.userGroup && product.toJSON());
    const totalProducts = productsData.length;
    const totalPages = Math.ceil(totalProducts / limit);

    return response
      .status(200)
      .json({ data: productsData, totalProducts, totalPages });
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve paged products.',
      reason: error,
      
    });
  }
});

module.exports = router;
