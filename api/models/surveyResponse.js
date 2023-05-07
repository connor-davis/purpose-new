const mongoose = require('mongoose');
const SurveySchema = require('../schemas/survey');

const SurveyResponseModel = mongoose.model('SurveyResponse', SurveySchema);

module.exports = SurveyResponseModel;
