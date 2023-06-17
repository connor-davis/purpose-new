const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const SurveyModel = require('../../models/survey');

/**
 * @openapi
 * /api/v2/surveys:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create a survey
 *     tags: [Surveys]
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
 *         description: The survey was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newSurvey = new SurveyModel({
      ...body,
      userGroup: request.user.userGroup
    });

    await newSurvey.save();

    return response.status(200).send('Ok');
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to create survey.',
      reason: error,
    });
  }
});

module.exports = router;
