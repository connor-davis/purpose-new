const { Router } = require('express');
const router = Router();
const ProductModel = require('../../models/product');

/**
 * @openapi
 * /api/v2/products:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a products data
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
 *             properties:
 *               _id:
 *                 description: The product's id
 *                 type: string
 *     responses:
 *       200:
 *         description: The product was updated successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.put('/', async (request, response) => {
  const body = request.body;

  try {
    await ProductModel.updateOne({ _id: { $eq: body._id } }, body);

    return response.status(200).send('Ok');
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ message: 'Failed to edit product data.', reason: error });
  }
});

module.exports = router;
