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
    growBedsCount: {
      type: Number,
      required: true,
    },
    hasGrowBags: {
      type: String,
      required: true,
    },
    growBagsCount: {
      type: Number,
      required: false,
    },
    seedling: {
      type: String,
      required: true,
    },
    seedlingCount: {
      type: Number,
      required: true,
    },
    equipmentOnSite: {
      type: Boolean,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = HarvestSchema;

/**
 * const productUser = await UserModel.findOne({
      _id: { $eq: product.user },
    });
 */
