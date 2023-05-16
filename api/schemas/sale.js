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
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        numberSold: {
          type: Number,
          required: true,
        },
      },
    ],
    profit: {
      type: Number,
      required: false,
      default: undefined
    },
    income: {
      type: Number,
      required: false,
      default: undefined,
    },
  },
  { timestamps: true }
);

module.exports = SaleSchema;
