const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const passport = require('passport');

/**
 * @openapi
 * /api/v2/documents:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all documents
 *     tags: [Documents]
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: Returns all the documents
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'documents'))) {
        fs.mkdirSync(path.join(process.cwd(), 'documents'));
      }

      const documents = fs
        .readdirSync(
          path.join(process.cwd(), 'documents'),
          {
            withFileTypes: true,
          }
        )
        .map((document) => {
          let documentname = document.name;
          const documentnamesplit = documentname.split('.');
          documentname = documentname.replace(documentnamesplit[0] + '.', '');

          return {
            name: documentname,
            user: documentnamesplit[0],
            isFile: document.isFile(),
          };
        });

      return response.status(200).json(documents);
    } catch (error) {
      console.log(error);
      console.log(error);

      return response
        .status(500)
        .json({ message: 'Failed to retrieve documents.', reason: error });
    }
  }
);

/**
 * @openapi
 * /api/v2/documents/{id}:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all documents
 *     tags: [Documents]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The documents user id
 *     responses:
 *       200:
 *         description: Returns all the documents
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get(
  '/:id',
  passport.authenticate('jwt', { session: false }),
  async (request, response) => {
    try {
      if (!fs.existsSync(path.join(process.cwd(), 'documents'))) {
        fs.mkdirSync(path.join(process.cwd(), 'documents'));
      }

      const documents = fs
        .readdirSync(
          path.join(process.cwd(), 'documents'),
          {
            withFileTypes: true,
          }
        )
        .filter((document) => {
          let documentname = document.name;
          const documentnamesplit = documentname.split('.');
          documentname = documentname.replace(documentnamesplit[0] + '.', '');

          return documentnamesplit[0] === request.params.id
            ? {
                name: document.name.replace(request.params.id + '.', ''),
                isFile: document.isFile(),
              }
            : undefined;
        });

      return response.status(200).json(documents);
    } catch (error) {
      console.log(error);
      console.log(error);

      return response
        .status(500)
        .json({ message: 'Failed to retrieve documents.', reason: error });
    }
  }
);

/**
 * @openapi
 * /api/v2/documents/view/{filename}:
 *   get:
 *     name: Get All
 *     security:
 *       - bearerAuth: []
 *     description: Get all a document by name
 *     tags: [Documents]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: filename
 *         schema:
 *           type: string
 *         required: true
 *         description: The documents name
 *     responses:
 *       200:
 *         description: Returns all the document with the name
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/view/:filename', async (request, response) => {
  try {
    if (!fs.existsSync(path.join(process.cwd(), 'documents'))) {
      fs.mkdirSync(path.join(process.cwd(), 'documents'));
    }

    if (
      !fs.existsSync(
        path.join(
          process.cwd(),
          'documents',
          request.params.filename
        )
      )
    )
      return response.status(404).json({ message: 'Document not found.' });
    else {
      return response
        .status(200)
        .sendFile(
          path.join(
            process.cwd(),
            'documents',
            request.params.filename
          )
        );
    }
  } catch (error) {
      console.log(error);
    console.log(error);

    return response.status(500).json({
      message: 'Failed to retrieve document with file name',
      reason: error,
    });
  }
});

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
router.use(
  '/',
  passport.authenticate('jwt', { session: false }),
  require('./delete')
);

module.exports = router;
