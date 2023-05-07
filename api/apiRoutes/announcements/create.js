const { Router } = require('express');
const router = Router();
const bcrypt = require('bcrypt');
const AnnouncementModal = require('../../models/announcement');

/**
 * @openapi
 * /api/v2/announcements:
 *   post:
 *     name: Create
 *     security:
 *       - bearerAuth: []
 *     description: Create an announcement
 *     tags: [Announcements]
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
 *         description: The announcement was created successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', async (request, response) => {
  const body = request.body;

  try {
    const newAnnouncement = new AnnouncementModal({
      ...body,
    });

    await newAnnouncement.save();

    return response.status(200).send('Ok');
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to create announcement.',
      reason: error,
    });
  }
});

module.exports = router;
