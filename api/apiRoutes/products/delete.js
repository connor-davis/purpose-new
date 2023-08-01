const { Router } = require('express');
const router = Router();
const ProductModel = require('../../models/product');

/**
 * @openapi
 * /api/v2/products/{id}:
 *   delete:
 *     name: Delete Product With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a product with the id
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
 *         description: The product was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await ProductModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send('Ok');
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Failed to delete product.',
      reason: error,
    });
  }
});

module.exports = router;
