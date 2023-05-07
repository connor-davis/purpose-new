const mongoose = require('mongoose');
const SurveySchema = require('../schemas/survey');

const SurveyModel = mongoose.model('Survey', SurveySchema);

module.exports = SurveyModel;
