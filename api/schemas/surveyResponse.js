const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
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
});

module.exports = SurveyResponseSchema;
