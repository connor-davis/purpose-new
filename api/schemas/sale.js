const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  _userId: {
    type: String,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  product: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  numberSold: {
    type: Number,
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
});

module.exports = SaleSchema;
