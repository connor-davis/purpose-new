const { Router } = require("express");
const router = Router();
const bcrypt = require("bcrypt");
const UserModel = require("../../models/user");

/**
 * @openapi
 * /api/v2/users:
 *   post:
 *     name: Create
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
        const mainUserFound = await UserModel.findOne({ userGroup: { $eq: body.userGroup }});

        if (!mainUserFound) return response.status(500).json({ message: "Invalid user group. Please get the correct user group from your administrator." });

        const userFound = await UserModel.findOne({ email: { $eq: body.email }});

        if (userFound) return response.status(500).json({ message: "Email already in use. Please use a different email." })
        else {
            const newUser = new UserModel({ ...body, password: bcrypt.hashSync(body.password, 2048) });

            await newUser.save();

            return response.status(200).send("Ok");
        }
    } catch (error) {
      console.log(error);
        return response.status(500).json({ message: "Failed to edit user data.", reason: error });
    }
});

module.exports = router;