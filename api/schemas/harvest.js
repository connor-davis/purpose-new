const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    produce: [
      {
        type: Object,
        required: true,
      },
    ],
  },
  { timestamps: true }
);

module.exports = HarvestSchema;

/**
 * const productUser = await UserModel.findOne({
      _id: { $eq: product.user },
    });
 */
