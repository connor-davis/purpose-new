const mongoose = require('mongoose');

const SaleSchema = new mongoose.Schema({
  _userId: {
    type: String,
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
