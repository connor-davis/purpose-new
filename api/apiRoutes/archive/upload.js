const { Router } = require('express');
const router = Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const adminRoute = require('../../utils/adminRoute');
const upload = multer({ dest: path.join(process.cwd(), 'temp', 'archives') });

/**
 * @openapi
 * /api/v2/archives/upload:
 *   post:
 *     name: Upload
 *     security:
 *       - bearerAuth: []
 *     description: Upload a archive
 *     tags: [Archives]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               upfiles:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: The archive was uploaded successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post(
  '/',
  adminRoute,
  upload.array('upfiles'),
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

      request.files.forEach((file) => {
        const fileData = fs.readFileSync(file.path);
        const newname = file.originalname;

        fs.writeFileSync(
          path.join(process.cwd(), 'archives', request.user.userGroup, newname),
          fileData
        );

        fs.unlinkSync(file.path);
      });

      return response.status(200).send('Ok');
    } catch (error) {
      return response
        .status(500)
        .json({ message: 'Failed to upload the archive.', reason: error });
    }
  }
);

module.exports = router;
