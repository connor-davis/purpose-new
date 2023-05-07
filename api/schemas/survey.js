const mongoose = require('mongoose');

const SurveySchema = new mongoose.Schema({
  surveyDate: {
    type: String,
    required: true,
  },
  surveyTitle: {
    type: String,
    required: true,
  },
  surveyQuestions: {
    type: String,
    required: true,
  },
  surveyUserType: {
    type: String,
    required: false,
    default: 'all',
  },
});

module.exports = SurveySchema;
