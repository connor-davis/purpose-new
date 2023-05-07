const mongoose = require("mongoose");
const HarvestSchema = require("../schemas/harvest");

const HarvestModel = mongoose.model("Harvest", HarvestSchema)

module.exports = HarvestModel;