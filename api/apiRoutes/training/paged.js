const { Router } = require('express');
const router = Router();
const TrainingModel = require('../../models/training');

/**
 * @openapi
 * /api/v2/training/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Training
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of training
 *     tags: [Training]
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
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         allowEmptyValue: true
 *         description: The training with userId
 *     responses:
 *       200:
 *         description: Returns the page of training
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const training = await TrainingModel.find(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    )
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit)
      .populate('user');
    const trainingData = training
      .map(
        (training) =>
          training.user.userGroup === request.user.userGroup &&
          training.toJSON()
      )
      .sort((a, b) => {
        if (new Date(a.date) > new Date(b.date)) return -1;
        if (new Date(a.date) < new Date(b.date)) return 1;

        return 0;
      });
    const totalTraining = await TrainingModel.countDocuments(
      !request.query.userId ? {} : { user: { $eq: request.query.userId } }
    );
    const totalPages = Math.ceil(totalTraining / limit);

    return response
      .status(200)
      .json({ data: trainingData, totalTraining, totalPages });
  } catch (error) {
    console.log(error);
    return response.status(500).json({
      message: 'Failed to retrieve paged training.',
      reason: error,
    });
  }
});

module.exports = router;
