const { Router } = require('express');
const router = Router();
const passport = require('passport');
const UserModel = require('../../models/user');
const userFormatter = require('../../utils/userFormatter');
const adminRoute = require('../../utils/adminRoute');

/**
 * @openapi
 * /api/v2/users:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all users
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the users
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', adminRoute, async (request, response) => {
  try {
    const users = await UserModel.find({ userType: { $ne: 'admin' } });
    const usersData = users.map((user) => userFormatter(user.toJSON()));

    return response.status(200).json(usersData);
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to retrieve users.',
        reason: error,
      });
  }
});

/**
 * @openapi
 * /api/v2/users/{email}:
 *   get:
 *     name: Get With Email
 *     security:
 *       - bearerAuth: []
 *     description: Get a user with their email
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: email
 *         schema:
 *           type: string
 *         required: true
 *         description: The users email
 *     responses:
 *       200:
 *         description: Returns the user with the email
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:email', adminRoute, async (request, response) => {
  const email = request.params.email;

  try {
    const user = await UserModel.findOne({ email: { $eq: email }, userType: { $ne: "admin" } });
    
    if (!user)
      return response
        .status(404)
        .json({ message: 'User not found.', error: 'user-not-found' });
    else {
        const userData = userFormatter(user.toJSON());
        return response.status(200).json(userData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the user.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use("/", require("./create"));
router.use("/", require("./edit"));
router.use("/", require("./delete"));

module.exports = router;
