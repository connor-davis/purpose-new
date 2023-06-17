const { Router } = require('express');
const router = Router();
const AnnouncementModal = require('../../models/announcement');
const passport = require('passport');

/**
 * @openapi
 * /api/v2/announcements:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all announcements
 *     tags: [Announcements]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the announcements
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/', async (request, response) => {
  try {
    const announcements = await AnnouncementModal.find({ userGroup: { $eq: request.user.userGroup }});
    const announcementsData = announcements
      .map((announcement) => announcement.toJSON())
      .sort((a, b) => {
        if (new Date(a.announcementDate) > new Date(b.announcementDate))
          return -1;
        if (new Date(a.announcementDate) < new Date(b.announcementDate))
          return 1;

        return 0;
      });

    return response.status(200).json(announcementsData);
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve announcements.',
      reason: error,
    });
  }
});

/**
 * @openapi
 * /api/v2/announcements/{id}:
 *   get:
 *     name: Get With Id
 *     security:
 *       - bearerAuth: []
 *     description: Get an announcement with its id
 *     tags: [Announcements]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The announcements id
 *     responses:
 *       200:
 *         description: Returns the announcement with the id
 *       404:
 *         description: Announcement not found.
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    const announcement = await AnnouncementModal.findOne({ _id: { $eq: id }, userGroup: { $eq: request.user.userGroup } });

    if (!announcement)
      return response.status(404).json({
        message: 'Announcement not found.',
        error: 'announcement-not-found',
      });
    else {
      const announcementData = announcement.toJSON();
      return response.status(200).json(announcementData);
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve the announcement.',
      reason: error,
    });
  }
});

router.use('/page', require('./paged'));
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./create')
);
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./delete')
);

module.exports = router;
