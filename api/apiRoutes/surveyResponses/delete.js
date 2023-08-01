const { Router } = require('express');
const router = Router();
const SurveyResponseModel = require('../../models/surveyResponse');

/**
 * @openapi
 * /api/v2/surveys/responses/{id}:
 *   delete:
 *     name: Delete Survey Response With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a survey response with the id
 *     tags: [Survey Responses]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The survey responses id
 *     responses:
 *       200:
 *         description: The survey response was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await SurveyResponseModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send('Ok');
  } catch (error) {
      console.log(error);
    return response.status(500).json({
      message: 'Failed to delete survey response.',
      reason: error,
    });
  }
});

module.exports = router;
