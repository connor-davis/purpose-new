const { Router } = require('express');
const router = Router();
const AnnouncementModal = require('../../models/announcement');
const SurveyModel = require('../../models/survey');

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
    const surveys = await SurveyModel.find({
      userGroup: { $eq: request.user.userGroup },
    })
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit);
    const surveysData = surveys
      .map((survey) => survey.toJSON())
      .sort((a, b) => {
        if (new Date(a.surveyDate) > new Date(b.surveyDate)) return -1;
        if (new Date(a.surveyDate) < new Date(b.surveyDate)) return 1;

        return 0;
      });
    const totalSurveys = await SurveyModel.countDocuments({
      userGroup: { $eq: request.user.userGroup },
    });
    const totalPages = Math.ceil(totalSurveys / limit);

    return response
      .status(200)
      .json({ data: surveysData, totalSurveys, totalPages });
  } catch (error) {
      console.log(error);
    return response.status(500).json({
      message: 'Failed to retrieve paged surveys.',
      reason: error,
    });
  }
});

module.exports = router;
