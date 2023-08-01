const { Router } = require("express");
const router = Router();
const HarvestModel = require("../../models/harvest");
const GrowBedModel = require("../../models/growBed");

/**
 * @openapi
 * /api/v2/growBeds:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a grow beds data
 *     tags: [Grow Beds]
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
 *                 description: The grow bed's id
 *                 type: string
 *     responses:
 *       200:
 *         description: The grow bed was updated successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.put("/", async (request, response) => {
    const body = request.body;
    
    try {
        await GrowBedModel.updateOne({ _id: { $eq: body._id }}, body);

        return response.status(200).send("Ok");
    } catch (error) {
      console.log(error);
        return response.status(500).json({ message: "Failed to edit grow bed data.", reason: error });
    }
});

module.exports = router;