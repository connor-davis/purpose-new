const { Router } = require("express");
const router = Router();
const ProduceModel = require("../../models/produce");

/**
 * @openapi
 * /api/v2/produce:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a produce' data
 *     tags: [Produce]
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
 *                 description: The produce' id
 *                 type: string
 *     responses:
 *       200:
 *         description: The produce was updated successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.put("/", async (request, response) => {
    const body = request.body;
    
    try {
        await ProduceModel.updateOne({ _id: { $eq: body._id }}, body);

        return response.status(200).send("Ok");
    } catch (error) {
        return response.status(500).json({ message: "Failed to edit produce data.", reason: error });
    }
});

module.exports = router;