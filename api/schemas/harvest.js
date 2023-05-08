const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  produce: {
    type: Array, // Array<mongoose.Schema.Types.ObjectId>
    required: true,
  },
});

module.exports = HarvestSchema;

/**
 * const productUser = await UserModel.findOne({
      _id: { $eq: product.user },
    });
 */
