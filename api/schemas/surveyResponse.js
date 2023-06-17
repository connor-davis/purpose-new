const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    surveyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Survey",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    answers: {
      type: Array,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = SurveyResponseSchema;
