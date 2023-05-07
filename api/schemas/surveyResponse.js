const mongoose = require('mongoose');

const SurveyResponseSchema = new mongoose.Schema({
  _userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  surveyId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  answers: {
    type: Array,
    required: true,
  },
});
