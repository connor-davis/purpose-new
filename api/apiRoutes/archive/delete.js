const { Router } = require('express');
const router = Router();
const fs = require('fs');
const path = require('path');
const adminRoute = require('../../utils/adminRoute');

/**
 * @openapi
 * /api/v2/archives/{archiveName}:
 *   delete:
 *     name: Delete Archive With Name
 *     security:
 *       - bearerAuth: []
 *     description: Delete a archive with the name
 *     tags: [Archives]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: archiveName
 *         schema:
 *           type: string
 *         required: true
 *         description: The archives name
 *     responses:
 *       200:
 *         description: The archive was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:archiveName', adminRoute, async (request, response) => {
  const archiveName = request.params.archiveName;

  try {
    if (!fs.existsSync(path.join(process.cwd(), 'archives', archiveName)))
      return response
        .status(404)
        .json({ message: 'Archive not found.', error: 'archive-not-found' });
    else {
      fs.unlinkSync(path.join(process.cwd(), 'archives', archiveName));

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
