const { Router } = require("express");
const router = Router();
const TrainingModel = require("../../models/training");

/**
 * @openapi
 * /api/v2/training:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a training data
 *     tags: [Training]
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
 *                 description: The training's id
 *                 type: string
 *     responses:
 *       200:
 *         description: The training was updated successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.put("/", async (request, response) => {
    const body = request.body;
    
    try {
        await TrainingModel.updateOne({ _id: { $eq: body._id }}, body);

        return response.status(200).send("Ok");
    } catch (error) {
      console.log(error);
        return response.status(500).json({ message: "Failed to edit training data.", reason: error });
    }
});

module.exports = router;