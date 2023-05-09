const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema(
  {
    surveyDate: {
      type: String,
      required: true,
    },
    surveyTitle: {
      type: String,
      required: true,
    },
    surveyQuestions: {
      type: Array,
      required: true,
    },
    surveyResponses: {
      type: Array,
      required: false,
      default: [],
    },
    surveyUserType: {
      type: String,
      required: false,
      default: 'all',
    },
  },
  { timestamps: true }
);

module.exports = SurveySchema;
