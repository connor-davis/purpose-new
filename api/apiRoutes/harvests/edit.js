const { Router } = require('express');
const router = Router();
const HarvestModel = require('../../models/harvest');

/**
 * @openapi
 * /api/v2/harvests:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a harvests data
 *     tags: [Harvests]
 *     produces:
 *       - application/json
 *     consumes:
 *       - application/json
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               _id:
 *                 description: The harvest's id
 *                 type: string
 *     responses:
 *       200:
 *         description: The harvest was updated successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.put('/', async (request, response) => {
  const body = request.body;

  try {
    await HarvestModel.updateOne({ _id: { $eq: body._id } }, body);

    return response.status(200).send('Ok');
  } catch (error) {
    console.log(error);
    return response
      .status(500)
      .json({ message: 'Failed to edit harvest data.', reason: error });
  }
});

module.exports = router;
