const { Router } = require('express');
const SurveyResponseModel = require('../../models/surveyResponse');
const router = Router();

/**
 * @openapi
 * /api/v2/surveys/page/{page}?limit={limit}:
 *   get:
 *     name: Get Page Of Surveys
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of surveys
 *     tags: [Surveys]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *         required: true
 *         description: The page number
 *       - in: path
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *         required: true
 *         description: The page limit
 *     responses:
 *       200:
 *         description: Returns the page of surveys
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const surveyResponses = await SurveyResponseModel.find({})
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .populate('user');
    const surveyResponsesData = surveyResponses
      .map(
        (surveyResponse) =>
          surveyResponse.user.userGroup === request.user.userGroup &&
          surveyResponse.toJSON()
      )
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });
    const totalSurveyResponses = await SurveyResponseModel.countDocuments({
      userGroup: { $eq: request.user.userGroup },
    });
    const totalPages = Math.ceil(totalSurveyResponses / limit);

    return response
      .status(200)
      .json({ data: surveyResponsesData, totalSurveyResponses, totalPages });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Failed to retrieve paged survey responses.',
      reason: error,
    });
  }
});

module.exports = router;
