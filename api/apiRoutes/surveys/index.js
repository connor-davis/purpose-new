const { Router } = require('express');
const router = Router();
const AnnouncementModal = require('../../models/announcement');
const passport = require('passport');
const SurveyModel = require('../../models/survey');

/**
 * @openapi
 * /api/v2/surveys:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all surveys
 *     tags: [Surveys]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the surveys
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const surveys = await SurveyModel.find({ userGroup: { $eq: request.user.userGroup }});
    const surveysData = surveys
      .map((survey) => survey.toJSON())
      .sort((a, b) => {
        if (new Date(a.surveyDate) > new Date(b.surveyDate)) return -1;
        if (new Date(a.surveyDate) < new Date(b.surveyDate)) return 1;

        return 0;
      });

    return response.status(200).json(surveysData);
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve surveys.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/surveys/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get an survey with its id
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
 *         description: Returns the survey with the id
 *       404:
 *         description: Survey not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const survey = await SurveyModel.findOne({ _id: { $eq: id } });

    if (!survey)
      return response.status(404).json({
        message: 'Survey not found.',
        error: 'survey-not-found',
      });
    else {
      const surveyData = survey.toJSON();
      return response.status(200).json(surveyData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the survey.',
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
