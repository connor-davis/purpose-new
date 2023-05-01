const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');

/**
 * @openapi
 * /api/v2/archives/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Archives
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of archives
 *     tags: [Archives]
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
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: false
 *         allowEmptyValue: true
 *         description: The archive with userId
 *     responses:
 *       200:
 *         description: Returns the page of archives
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    if (!fs.existsSync(path.join(process.cwd(), 'archives'))) {
      fs.mkdirSync(path.join(process.cwd(), 'archives'));
    }

    const archives = fs
      .readdirSync(path.join(process.cwd(), 'archives'), {
        withFileTypes: true,
      })
      .map((archive) => {
        let archivename = archive.name;
        const archivenamesplit = archivename.split('.');
        archivename = archivename.replace(archivenamesplit[0] + '.', '');

        return request.query.userId !== (undefined || null || '')
          ? archivenamesplit[0] === request.query.userid
            ? {
                name: archivename,
                isFile: archive.isFile(),
              }
            : undefined
          : {
              name: archivename,
              _userId: archivenamesplit[0],
              isFile: archive.isFile(),
            };
      });
    const archivesData = archives.filter(
      (_, index) => index >= page * limit - 10 && index < page * limit
    );
    const totalArchives = archives.length;
    const totalPages = Math.ceil(totalArchives / limit);

    return response
      .status(200)
      .json({ data: archivesData, totalArchives, totalPages });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve paged archives.', reason: error });
  }
});

module.exports = router;
