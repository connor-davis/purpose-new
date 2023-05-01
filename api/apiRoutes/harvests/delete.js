const { Router } = require('express');
const router = Router();
const HarvestModel = require('../../models/harvest');

/**
 * @openapi
 * /api/v2/harvests/{id}:
 *   delete:
 *     name: Delete Harvest With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a harvest with the id
 *     tags: [Harvests]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The harvests id
 *     responses:
 *       200:
 *         description: The harvest was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await HarvestModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send("Ok");
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to delete product.',
        reason: error,
      });
  }
});

module.exports = router;
