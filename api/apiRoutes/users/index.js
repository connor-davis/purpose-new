const { Router } = require('express');
const router = Router();
const passport = require('passport');
const UserModel = require('../../models/user');
const userFormatter = require('../../utils/userFormatter');
const adminRoute = require('../../utils/adminRoute');
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');

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
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  adminRoute,
  async (request, response) => {
    try {
      const users = await UserModel.find({ userType: { $ne: 'admin' }, userGroup: { $eq: request.user.userGroup } });
      const usersData = users.map((user) => userFormatter(user.toJSON()));

      return response.status(200).json(usersData);
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: 'Failed to retrieve users.',
        reason: error,
      });
    }
  }
);

/**
 * @openapi
 * /api/v2/users/me:
 *   get:
 *     name: Get Self
 *     security:
 *       - bearerAuth: []
 *     description: Get the user thats logged in
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns the user thats logged in
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/me',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    const email = request.user.email;

    try {
      const user = await UserModel.findOne({ email: { $eq: email } });

      if (!user)
        return response
          .status(404)
          .json({ message: 'User not found.', error: 'user-not-found' });
      else {
        const userData = userFormatter(user.toJSON());
        return response.status(200).json(userData);
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: 'Failed to retrieve the user.',
        reason: error,
      });
    }
  }
);

/**
 * @openapi
 * /api/v2/users/{userId}:
 *   get:
 *     name: Get With User Id
 *     security:
 *       - bearerAuth: []
 *     description: Get a user with their id
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
 *         description: Returns the user with the id
 *       404:
 *         description: User not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/:userId',
  passport.authenticate('jwt', { session: false }),
  adminRoute,
  async (request, response) => {
    const userId = request.params.userId;

    try {
      const user = await UserModel.findOne({
        _id: { $eq: userId },
        userType: { $ne: 'admin' },
        userGroup: { $eq: request.user.userGroup }
      });

      if (!user)
        return response
          .status(404)
          .json({ message: 'User not found.', error: 'user-not-found' });
      else {
        const userData = userFormatter(user.toJSON());
        return response.status(200).json(userData);
      }
    } catch (error) {
      console.log(error);
      return response.status(500).json({
        message: 'Failed to retrieve the user.',
        reason: error,
      });
    }
  }
);

router.use(
  '/page',
  passport.authenticate('jwt', { session: false }),
  require('./paged')
);
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./create')
);
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./edit')
);
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./delete')
);
router.use(
  '/become',
  passport.authenticate('jwt', { session: false }),
  adminRoute,
  require('./become')
);

module.exports = router;
