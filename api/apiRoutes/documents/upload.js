const { Router } = require('express');
const router = Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const upload = multer({ dest: path.join(process.cwd(), 'temp', 'documents') });

/**
 * @openapi
 * /api/v2/documents/upload:
 *   post:
 *     name: Upload
 *     security:
 *       - bearerAuth: []
 *     description: Upload a document
 *     tags: [Documents]
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
 *         description: The document was uploaded successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.post('/', upload.array('upfiles'), async (request, response) => {
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'documents'))) {
      fs.mkdirSync(path.join(process.cwd(), 'documents'));
    }

    request.files.forEach((file) => {
      const fileData = fs.readFileSync(file.path);
      const newname = request.user._id + "." + request.user.userGroup + '.' + file.originalname;

      fs.writeFileSync(
        path.join(process.cwd(), 'documents', newname),
        fileData
      );

      fs.unlinkSync(file.path);
    });

    return response.status(200).send('Ok');
  } catch (error) {
      console.log(error);
    return response
      .status(500)
      .json({ message: 'Failed to upload the document.', reason: error });
  }
});

module.exports = router;
