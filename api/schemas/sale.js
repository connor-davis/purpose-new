const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema(
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
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true,
      },
    ],
    profit: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = SaleSchema;
