const { Router } = require('express');
const router = Router();
const UserModel = require('../../models/user');
const ProductModel = require('../../models/product');
const HarvestModel = require('../../models/harvest');
const SaleModel = require('../../models/sale');
const fs = require("fs");
const path = require("path");

/**
 * @openapi
 * /api/v2/users/{id}:
 *   delete:
 *     name: Delete User With Id
 *     security:
 *       - bearerAuth: []
 *     description: Delete a user with the id
 *     tags: [Users]
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The users id
 *     responses:
 *       200:
 *         description: The user was deleted successfully
 *       500:
 *         description: Failure returns the message, reason and error code
 */
router.delete('/:id', async (request, response) => {
  const id = request.params.id;

  try {
    await ProductModel.deleteMany({ user: { $eq: id } });
    await SaleModel.deleteMany({ user: { $eq: id } });
    await HarvestModel.deleteMany({ user: { $eq: id } });

    const files = fs.readdirSync(path.join(process.cwd(), "files"));
    const documents = fs.readdirSync(path.join(process.cwd(), "documents"));

    const filesToDelete = files.map((fpath) => fpath.includes(id));
    const documentsToDelete = documents.map((fpath) => fpath.includes(id));

    filesToDelete.forEach((fpath) => fs.unlinkSync(path.join(process.cwd(), "files", fpath)));
    documentsToDelete.forEach((fpath) => fs.unlinkSync(path.join(process.cwd(), "documents", fpath)));
    
    await UserModel.deleteOne({ _id: { $eq: id } });

    return response.status(200).send('Ok');
  } catch (error) {
    return response.status(500).json({
      message: 'Failed to delete user.',
      reason: error,
    });
  }
});

module.exports = router;
