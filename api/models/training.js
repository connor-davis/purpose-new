const mongoose = require("mongoose");
const TrainingSchema = require("../schemas/training");

const TrainingModel = mongoose.model("Training", TrainingSchema);

module.exports = TrainingModel;