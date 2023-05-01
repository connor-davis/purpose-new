const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  _userId: {
    type: String,
    required: true,
  },
  yield: {
    type: Number,
    required: true,
  },
  weight: {
    type: Number,
    required: true,
  },
  date: {
    type: Number,
    required: true,
  },
  produce: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
});

module.exports = HarvestSchema;
