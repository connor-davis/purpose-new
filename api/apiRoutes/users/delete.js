const { Router } = require('express');
const router = Router();
const UserModel = require('../../models/user');

/**
 * @openapi
 * /api/v2/users/{id}:
 *   delete:
 *     name: Delete User With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a user with the id
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     responses:
 *       200:
 *         description: The user was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await UserModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send("Ok");
  } catch (error) {
    return response
      .status(500)
      .json({
        message: 'Failed to delete user.',
        reason: error,
      });
  }
});

module.exports = router;
