const { Router } = require('express');
const router = Router();
const ProductModel = require('../../models/product');

/**
 * @openapi
 * /api/v2/products:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all products
 *     tags: [Products]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the products
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const products = await ProductModel.find(request.user.userType !== "admin" ? {} : { user: { $eq: request.user._id } }).populate("user");
    const productsData = products.map((product) => product.user.userGroup === request.user.userGroup && product.toJSON());

    return response.status(200).json(productsData);
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to retrieve products.',
        reason: error,
      });
  }
});

/**
 * @openapi
 * /api/v2/products/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a product with its id
 *     tags: [Products]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The products id
 *     responses:
 *       200:
 *         description: Returns the product with the id
 *       404:
 *         description: Product not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const product = await ProductModel.findOne({ _id: { $eq: id } });
    
    if (!product)
      return response
        .status(404)
        .json({ message: 'Product not found.', error: 'product-not-found' });
    else {
        const productData = product.toJSON()
        return response.status(200).json(productData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the product.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use("/", require("./create"));
router.use("/", require("./edit"));
router.use("/", require("./delete"));

module.exports = router;
