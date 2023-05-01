const { Router } = require('express');
const router = Router();
const SaleModel = require('../../models/sale');

/**
 * @openapi
 * /api/v2/sales/{id}:
 *   delete:
 *     name: Delete Sale With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a sale with the id
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
 *         description: The sale was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await SaleModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send("Ok");
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to delete sale.',
        reason: error,
        
      });
  }
});

module.exports = router;
