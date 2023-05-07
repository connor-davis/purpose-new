const mongoose = require('mongoose');

const HarvestSchema = new mongoose.Schema({
  _userId: {
    type: String,
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
