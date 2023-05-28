const { Router } = require('express');
const router = Router();
const WasteModel = require('../../models/waste');

/**
 * @openapi
 * /api/v2/waste/{id}:
 *   delete:
 *     name: Delete Waste With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a waste with the id
 *     tags: [Waste]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The waste id
 *     responses:
 *       200:
 *         description: The waste was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await WasteModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send("Ok");
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to delete waste.',
        reason: error,
        
      });
  }
});

module.exports = router;
