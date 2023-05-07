const mongoose = require('mongoose');
const ProduceSchema = require('../schemas/produce');

const ProduceModel = mongoose.model('Produce', ProduceSchema);

module.exports = ProduceModel;
