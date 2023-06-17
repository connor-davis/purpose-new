const { Router } = require('express');
const router = Router();
const passport = require('passport');
const SurveyResponseModel = require('../../models/surveyResponse');
const adminRoute = require('../../utils/adminRoute');

/**
 * @openapi
 * /api/v2/surveys/response:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all survey responses
 *     tags: [Survey Responses]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the survey responses
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const surveyResponses = await SurveyResponseModel.find({}).populate("user");
    const surveyResponsesData = surveyResponses
      .map((surveyResponse) => surveyResponse.user.userGroup === request.user.userGroup && surveyResponse.toJSON())
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });

    return response.status(200).json(surveyResponsesData);
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve survey responses.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/surveys/responses/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a survey response with its survey id
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
 *         description: Returns the survey response with the survey id
 *       404:
 *         description: Survey response not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', adminRoute, async (request, response) => {
  const id = request.params.id;

  try {
    const surveyResponses = await SurveyResponseModel.find({
      surveyId: { $eq: id }
    }).populate("user");

    if (surveyResponses.length === 0)
      return response.status(404).json({
        message: 'Survey response not found.',
        error: 'survey-response-not-found',
      });
    else {
      const surveyResponsesData = surveyResponses.map((surveyResponse) =>
        surveyResponse.user.userGroup === request.user.userGroup && surveyResponse.toJSON()
      );
      return response.status(200).json(surveyResponsesData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the survey response.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./create')
);
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./delete')
);

module.exports = router;
