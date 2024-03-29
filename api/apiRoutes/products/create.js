const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const ProductModel = require('../../models/product');

/**
 * @openapi
 * /api/v2/products:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a product
 *     tags: [Products]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The product was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newProduct = new ProductModel({
      ...body,
      user: request.user._id,
    });

    await newProduct.save();

    return response.status(200).send('Ok');
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Failed to create product.',
      reason: error,
    });
  }
});

module.exports = router;
