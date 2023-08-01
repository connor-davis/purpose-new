const { Router } = require('express');
const router = Router();
const AnnouncementModal = require('../../models/announcement');

/**
 * @openapi
 * /api/v2/announcements/page/{page}?limit={limit}:
 *   get:
 *     name: Get Page Of Announcements
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of announcements
 *     tags: [Announcements]
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
 *         description: Returns the page of announcements
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    const announcements = await AnnouncementModal.find({ userGroup: { $eq: request.user.userGroup }})
      .skip((page - 1) * limit > 0 ? (page - 1) * limit : 0)
      .limit(limit);
    const announcementsData = announcements
      .map((announcement) => announcement.toJSON())
      .sort((a, b) => {
        if (new Date(a.announcementDate) > new Date(b.announcementDate))
          return -1;
        if (new Date(a.announcementDate) < new Date(b.announcementDate))
          return 1;

        return 0;
      });
    const totalAnnouncements = announcementsData.length;
    const totalPages = Math.ceil(totalAnnouncements / limit);

    return response
      .status(200)
      .json({ data: announcementsData, totalAnnouncements, totalPages });
  } catch (error) {
      console.log(error);
    console.log(error);
    
    return response.status(500).json({
      message: 'Failed to retrieve paged announcements.',
      reason: error,
    });
  }
});

module.exports = router;
