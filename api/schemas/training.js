const mongoose = require('mongoose');

const TrainingSchema = new mongoose.Schema(
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
    numberTrained: {
      type: Number,
      required: true,
    },
    trainingType: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = TrainingSchema;
