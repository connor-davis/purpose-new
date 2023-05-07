const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');

/**
 * @openapi
 * /api/v2/documents/{documentName}:
 *   delete:
 *     name: Delete Document With Name
 *     security:
 *       - bearerAuth: []
 *     description: Delete a document with the name
 *     tags: [Documents]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: documentName
 *         schema:
 *           type: string
 *         required: true
 *         description: The documents name
 *     responses:
 *       200:
 *         description: The document was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:documentName', async (request, response) => {
  const documentName = request.params.documentName;

  try {
    if (!fs.existsSync(path.join(process.cwd(), 'documents', documentName)))
      return response
        .status(404)
        .json({ message: 'Document not found.', error: 'document-not-found' });
    else {
      fs.unlinkSync(path.join(process.cwd(), 'documents', documentName));

      return response.status(200).send('Ok');
    }
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to delete archive.',
      reason: error,
    });
  }
});

module.exports = router;
