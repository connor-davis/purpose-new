const { Router } = require('express');
const router = Router();
const TrainingModel = require('../../models/training');

/**
 * @openapi
 * /api/v2/training/{id}:
 *   delete:
 *     name: Delete Training With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a training with the id
 *     tags: [Training]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The training id
 *     responses:
 *       200:
 *         description: The training was deleted successfully
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
        message: 'Failed to delete training.',
        reason: error,
        
      });
  }
});

module.exports = router;
