const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const UserModel = require("../../models/user");

/**
 * @openapi
 * /api/v2/users:
 *   post:
 *     name: Edit
 *     security:
 *       - bearerAuth: []
 *     description: Create a user
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
 *     responses:
 *       200:
 *         description: The user was created successfully
 *       500:
 *         description: Failure because the email is already in use or failure returns the message, reason and error code
 */
router.post("/", async (request, response) => {
    const body = request.body;
    
    try {
        const userFound = await UserModel.findOne({ email: { $eq: body.email }})

        if (userFound) return response.status(500).json({ message: "Email already in use. Please use a different email." })
        else {
            const newUser = new UserModel({ ...body, password: bcrypt.hashSync(body.password, 2048) });

            await newUser.save();

            return response.status(200).send("Ok");
        }
    } catch (error) {
        return response.status(500).json({ message: "Failed to edit user data.", reason: error });
    }
});

module.exports = router;