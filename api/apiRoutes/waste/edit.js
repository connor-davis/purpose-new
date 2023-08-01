const { Router } = require("express");
const router = Router();
const WasteModel = require("../../models/waste");

/**
 * @openapi
 * /api/v2/waste:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a waste data
 *     tags: [Waste]
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
 *                 description: The waste's id
 *                 type: string
 *     responses:
 *       200:
 *         description: The waste was updated successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.put("/", async (request, response) => {
    const body = request.body;
    
    try {
        await WasteModel.updateOne({ _id: { $eq: body._id }}, body);

        return response.status(200).send("Ok");
    } catch (error) {
      console.log(error);
        return response.status(500).json({ message: "Failed to edit waste data.", reason: error });
    }
});

module.exports = router;