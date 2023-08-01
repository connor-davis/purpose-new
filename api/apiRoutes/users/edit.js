const { Router } = require("express");
const router = Router();
const UserModel = require("../../models/user");

/**
 * @openapi
 * /api/v2/users:
 *   put:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Edit a users data
 *     tags: [Users]
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
 *                 description: The user's id
 *                 type: string
 *     responses:
 *       200:
 *         description: The user was updated successfully
 *       500:
 *         description: Failure because the email is already in use or failure returns the message, reason and error code
 */
router.put("/", async (request, response) => {
    const body = request.body;

    try {
        await UserModel.updateOne({ _id: { $eq: body._id }}, body);

        return response.status(200).send("Ok");
    } catch (error) {
      console.log(error);
        return response.status(500).json({ message: "Failed to edit user data.", reason: error });
    }
});

module.exports = router;