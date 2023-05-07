const mongoose = require('mongoose');
const SurveyResponseSchema = require('../schemas/surveyResponse');

const SurveyResponseModel = mongoose.model(
  'SurveyResponse',
  SurveyResponseSchema
);

module.exports = SurveyResponseModel;
