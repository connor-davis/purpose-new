const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');

/**
 * @openapi
 * /api/v2/files:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all files
 *     tags: [Files]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the files
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'files'))) {
        fs.mkdirSync(path.join(process.cwd(), 'files'));
      }

      const files = fs
        .readdirSync(path.join(process.cwd(), 'files'), {
          withFileTypes: true,
        })
        .map((file) => {
          let filename = file.name;
          const filenamesplit = filename.split('.');
          filename = filename.replace(filenamesplit[0] + '.', '');

          return {
            name: filename,
            _userId: filenamesplit[0],
            isFile: file.isFile(),
          };
        });

      return response.status(200).json(files);
    } catch (error) {
      console.log(error);

      return response
        .status(500)
        .json({ message: 'Failed to retrieve files.', reason: error });
    }
  }
);

/**
 * @openapi
 * /api/v2/files/{id}:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all files
 *     tags: [Files]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The files user id
 *     responses:
 *       200:
 *         description: Returns all the files
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'files'))) {
        fs.mkdirSync(path.join(process.cwd(), 'files'));
      }

      const files = fs
        .readdirSync(path.join(process.cwd(), 'files'), {
          withFileTypes: true,
        })
        .filter((file) => {
          let filename = file.name;
          const filenamesplit = filename.split('.');
          filename = filename.replace(filenamesplit[0] + '.', '');

          return filenamesplit[0] === request.params.id
            ? {
                name: filename,
                isFile: file.isFile(),
              }
            : undefined;
        });

      return response.status(200).json(files);
    } catch (error) {
      return response.status(500).json({
        message: 'Failed to retrieve files for user id.',
        reason: error,
      });
    }
  }
);

/**
 * @openapi
 * /api/v2/files/view/{filename}:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get a file by name
 *     tags: [Files]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The files name
 *     responses:
 *       200:
 *         description: Returns all the file with the name
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/view/:filename', async (request, response) => {
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'files'))) {
      fs.mkdirSync(path.join(process.cwd(), 'files'));
    }

    if (
      !fs.existsSync(path.join(process.cwd(), 'files', request.params.filename))
    )
      return response.status(404).json({ message: 'File not found.' });
    else {
      return response
        .status(200)
        .sendFile(path.join(process.cwd(), 'files', request.params.filename));
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to retrieve files for user id.',
      reason: error,
    });
  }
});

router.use(
  '/upload',
  passport.authenticate('jwt', { session: false }),
  require('./upload')
);

module.exports = router;
