const { Router } = require('express');
const UserModel = require('../../models/user');
const userFormatter = require('../../utils/userFormatter');
const router = Router();

/**
 * @openapi
 * /api/v2/training/attendees/search?filter={filter}:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all attendees for training by type filter
 *     tags: [Training]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the attendees found with a similar user type
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  const filterText = request.query.filter ? request.query.filter : '';

  try {
    const usersFound = await UserModel.find({ userType: { $ne: 'admin' }, userGroup: { $eq: request.user.userGroup } });

    if (!usersFound)
      return response.status(404).json({
        message: 'Users not found.',
        reason: 'users-not-found',
      });
    else {
      const filter = new RegExp(filterText, 'ig');
      const users = usersFound
        .map((user) => {
          const data = userFormatter(user.toJSON());

          return data;
        })
        .filter(
          (user) =>
            filter.test(user.email) ||
            filter.test(user.firstName) ||
            filter.test(user.lastName) ||
            filter.test(user.businessName)
        );

      return response.status(200).json({ data: users });
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve training.',
      reason: error,
    });
  }
});

module.exports = router;
