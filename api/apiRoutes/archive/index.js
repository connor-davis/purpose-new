const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');
const adminRoute = require('../../utils/adminRoute');

/**
 * @openapi
 * /api/v2/archives:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all archives
 *     tags: [Archives]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the archives
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'archives'))) {
        fs.mkdirSync(path.join(process.cwd(), 'archives'));
      }

      if (
        !fs.existsSync(
          path.join(process.cwd(), 'archives', request.user.userGroup)
        )
      ) {
        fs.mkdirSync(
          path.join(process.cwd(), 'archives', request.user.userGroup)
        );
      }

      const archives = fs
        .readdirSync(
          path.join(process.cwd(), 'archives', request.user.userGroup),
          {
            withFileTypes: true,
          }
        )
        .map((archive) => {
          console.log(archive);

          let archivename = archive.name;

          return {
            name: archivename,
            isFile: archive.isFile(),
          };
        });

      return response.status(200).json(archives);
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Failed to retrieve archives.', reason: error });
    }
  }
);

/**
 * @openapi
 * /api/v2/archives/view/{filename}:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all a archive by name
 *     tags: [Archives]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The archives name
 *     responses:
 *       200:
 *         description: Returns all the archive with the name
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/view/:filename', async (request, response) => {
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'archives'))) {
      fs.mkdirSync(path.join(process.cwd(), 'archives'));
    }

    if (
      !fs.existsSync(
        path.join(process.cwd(), 'archives', request.params.filename)
      )
    )
      return response.status(404).json({ message: 'Archive not found.' });
    else {
      return response
        .status(200)
        .sendFile(
          path.join(process.cwd(), 'archives', request.params.filename)
        );
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve archive with file name',
      reason: error,
    });
  }
});

router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./delete')
);
router.use(
  '/page',
  passport.authenticate('jwt', { session: false }),
  require('./paged')
);
router.use(
  '/upload',
  passport.authenticate('jwt', { session: false }),
  require('./upload')
);

module.exports = router;
