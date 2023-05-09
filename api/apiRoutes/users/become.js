const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const UserModel = require('../../models/user');
const userFormatter = require('../../utils/userFormatter');
const jwt = require('jsonwebtoken');
const fs = require("fs");
const path = require("path");

/**
 * @openapi
 * /api/v2/users/become/{userId}:
 *   get:
 *     name: Become
 *     security:
 *       - bearerAuth: []
 *     description: Allow the admin to become a user easily.
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     responses:
 *       200:
 *         description: The admin successfully became the user.
 *       500:
 *         description: Failure because the email is already in use or failure returns the message, reason and error code
 */
router.get('/:userId', async (request, response) => {
  const userId = request.params.userId;

  console.log(userId);

  try {
    let privateKey = fs.readFileSync(process.cwd() + '/certs/privateKey.pem', {
      encoding: 'utf-8',
    });

    const userFound = await UserModel.findOne({ _id: { $eq: userId } });

    if (!userFound)
      return response
        .status(404)
        .json({ message: 'User not found.', reason: 'user-not-found' });
    else {
      let token = jwt.sign(
        {
          sub: userFound.email,
        },
        privateKey,
        { expiresIn: '1d', algorithm: 'RS256' }
      );

      return response.status(200).json({
        success: 'Successfully became user.',
        data: {
          ...userFormatter(userFound.toJSON()),
        },
        token,
      });
    }
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to edit user data.', reason: error });
  }
});

module.exports = router;
