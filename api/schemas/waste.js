const mongoose = require('mongoose');

const WasteSchema = new mongoose.Schema(
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
    kgs: {
      type: Number,
      required: true,
    },
    wasteType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = WasteSchema;
