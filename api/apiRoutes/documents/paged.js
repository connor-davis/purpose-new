const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');

/**
 * @openapi
 * /api/v2/documents/page/{page}?limit={limit}&userId={userId}:
 *   get:
 *     name: Get Page Of Documents
 *     security:
 *       - bearerAuth: []
 *     description: Get a page of documents
 *     tags: [Documents]
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
 *         description: Returns the page of documents
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.get('/:page', async (request, response) => {
  const page = request.params.page;
  const limit = request.query.limit || 10;

  try {
    if (!fs.existsSync(path.join(process.cwd(), 'documents'))) {
      fs.mkdirSync(path.join(process.cwd(), 'documents'));
    }

    const documents = fs
      .readdirSync(path.join(process.cwd(), 'documents'), {
        withFileTypes: true,
      })
      .map((document) => {
        let documentname = document.name;
        const documentnamesplit = documentname.split('.');
        documentname = documentname.replace(documentnamesplit[0] + '.', '');

        return {
          name: documentname,
          user: documentnamesplit[0],
          isFile: document.isFile(),
        };
      })
      .filter((documentData) => {
        if (request.query.userId) {
          if (documentData.user === request.query.userId) return true;
          else return false;
        } else return true;
      });
    const documentsData = documents.filter((_, index) => {
      if (index < page * limit && index >= page * limit - limit) return true;
      else return false;
    });
    const totalDocuments = documents.length;
    const totalPages = Math.ceil(totalDocuments / limit);

    return response
      .status(200)
      .json({ data: documentsData, totalDocuments, totalPages });
  } catch (error) {
    return response
      .status(500)
      .json({ message: 'Failed to retrieve paged documents.', reason: error });
  }
});

module.exports = router;
