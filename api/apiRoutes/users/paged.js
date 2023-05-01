const { Router } = require('express');
const router = Router();
const adminRoute = require('../../utils/adminRoute');
const userFormatter = require('../../utils/userFormatter');
const UserModel = require('../../models/user');

/**
 * @openapi
 * /api/v2/users/page/{page}?limit={limit}:
 *   get:
 *     name: Get Page Of Users
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of users
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: page
 *         schema:
 *           type: integer
 *         default: 1
 *         required: true
 *         description: The page number
 *       - in: path
 *         name: limit
 *         schema:
 *           type: integer
 *         default: 10
 *         required: true
 *         description: The page limit
 *     responses:
 *       200:
 *         description: Returns the page of users
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', adminRoute, async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const users = await UserModel.find({ userType: { $ne: 'admin' } })
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit);
    const usersData = users.map((user) => userFormatter(user.toJSON()));
    const totalUsers = await UserModel.countDocuments({
      userType: { $ne: 'admin' },
    });
    const totalPages = Math.ceil(totalUsers / limit);

    return response
      .status(200)
      .json({ data: usersData, totalUsers, totalPages });
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve paged users.',
      reason: error,
    });
  }
});

module.exports = router;
