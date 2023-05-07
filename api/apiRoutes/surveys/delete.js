const { Router } = require('express');
const router = Router();
const SurveyModel = require('../../models/survey');

/**
 * @openapi
 * /api/v2/announcements/{id}:
 *   delete:
 *     name: Delete Announcement With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete an announcement with the id
 *     tags: [Announcements]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The announcements id
 *     responses:
 *       200:
 *         description: The announcement was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await SurveyModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send("Ok");
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to delete announcement.',
        reason: error,
        
      });
  }
});

module.exports = router;
