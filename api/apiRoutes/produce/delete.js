const { Router } = require('express');
const router = Router();
const ProduceModel = require('../../models/produce');

/**
 * @openapi
 * /api/v2/produce/{id}:
 *   delete:
 *     name: Delete Produce With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a produce with the id
 *     tags: [Produce]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The produce' id
 *     responses:
 *       200:
 *         description: The produce was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await ProduceModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send("Ok");
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to delete produce.',
        reason: error,
      });
  }
});

module.exports = router;
