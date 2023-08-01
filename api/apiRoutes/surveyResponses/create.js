const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const SurveyResponseModel = require('../../models/surveyResponse');

/**
 * @openapi
 * /api/v2/surveys/responses:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a survey response
 *     tags: [Survey Responses]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: The survey response was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newSurvey = new SurveyResponseModel({
      ...body,
      user: request.user._id
    });

    await newSurvey.save();

    return response.status(200).send('Ok');
  } catch (error) {
      console.log(error);
    return response.status(500).json({
      message: 'Failed to create survey response.',
      reason: error,
    });
  }
});

module.exports = router;
