const { Router } = require('express');
const router = Router();
const SurveyModel = require('../../models/survey');

/**
 * @openapi
 * /api/v2/surveys/{id}:
 *   delete:
 *     name: Delete Survey With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete an survey with the id
 *     tags: [Surveys]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The surveys id
 *     responses:
 *       200:
 *         description: The survey was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await SurveyModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send('Ok');
  } catch (error) {
      console.log(error);
    return response.status(500).json({
      message: 'Failed to delete survey.',
      reason: error,
    });
  }
});

module.exports = router;
