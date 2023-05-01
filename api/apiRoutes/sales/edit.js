const { Router } = require("express");
const router = Router();
const SaleModel = require("../../models/sale");

/**
 * @openapi
 * /api/v2/sales:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a sales data
 *     tags: [Sales]
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
 *                 description: The sale's id
 *                 type: string
 *     responses:
 *       200:
 *         description: The sale was updated successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.put("/", async (request, response) => {
    const body = request.body;
    
    try {
        await SaleModel.updateOne({ _id: { $eq: body._id }}, body);

        return response.status(200).send("Ok");
    } catch (error) {
        return response.status(500).json({ message: "Failed to edit sale data.", reason: error });
    }
});

module.exports = router;