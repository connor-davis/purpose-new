const { Router } = require('express');
const router = Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: path.join(process.cwd(), 'temp', 'files') });

/**
 * @openapi
 * /api/v2/files/upload:
 *   post:
 *     name: Upload
 *     security:
 *       - bearerAuth: []
 *     description: Upload a file
 *     tags: [Files]
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
 *         description: The file was uploaded successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', upload.array('upfiles'), async (request, response) => {
  console.log(request.user);
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'files'))) {
      fs.mkdirSync(path.join(process.cwd(), 'files'));
    }

    const filenames = [];

    request.files.forEach((file) => {
      const fileData = fs.readFileSync(file.path);
      const newname = request.user._id + '.' + request.user.userGroup + '.' + file.originalname;

      fs.writeFileSync(
        path.join(process.cwd(), 'files', newname),
        fileData
      );

      fs.unlinkSync(file.path);

      filenames.push(newname);
    });

    return response.status(200).json({ filenames });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to upload the file.', reason: error });
  }
});

module.exports = router;
