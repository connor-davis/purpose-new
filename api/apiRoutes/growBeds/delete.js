const { Router } = require('express');
const router = Router();
const HarvestModel = require('../../models/harvest');
const GrowBedModel = require('../../models/growBed');

/**
 * @openapi
 * /api/v2/growBeds/{id}:
 *   delete:
 *     name: Delete Grow Bed With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a grow bed with the id
 *     tags: [Grow Beds]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The grow beds id
 *     responses:
 *       200:
 *         description: The grow bed was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await GrowBedModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send("Ok");
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to delete grow bed.',
        reason: error,
      });
  }
});

module.exports = router;
