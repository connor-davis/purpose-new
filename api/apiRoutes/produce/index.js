const { Router } = require('express');
const router = Router();
const ProduceModel = require('../../models/produce');

/**
 * @openapi
 * /api/v2/produce:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all produce
 *     tags: [Produce]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the produce
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const produce = await ProduceModel.find(request.user.userType !== "admin" ? {} : { _userId: { $eq: request.user._id } });
    const produceData = produce.map((produce) => produce.toJSON());

    return response.status(200).json(produceData);
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to retrieve products.',
        reason: error,
      });
  }
});

/**
 * @openapi
 * /api/v2/produce/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a produce with its id
 *     tags: [Produce]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The produce id
 *     responses:
 *       200:
 *         description: Returns the produce with the id
 *       404:
 *         description: Produce not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const produce = await ProduceModel.findOne({ _id: { $eq: id } });
    
    if (!produce)
      return response
        .status(404)
        .json({ message: 'Produce not found.', error: 'produce-not-found' });
    else {
        const produceData = produce.toJSON()
        return response.status(200).json(produceData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the produce.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use("/", require("./create"));
router.use("/", require("./edit"));
router.use("/", require("./delete"));

module.exports = router;
