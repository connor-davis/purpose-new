const mongoose = require("mongoose");
const HarvestSchema = require("../schemas/harvest");

module.exports = mongoose.model("Harvest", HarvestSchema);