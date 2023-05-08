const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: String,
    required: true,
  },
  products: {
    type: Array, // Array<mongoose.Schema.Types.ObjectId>
    required: true,
  },
  profit: {
    type: Number,
    required: true,
  },
});

module.exports = SaleSchema;
