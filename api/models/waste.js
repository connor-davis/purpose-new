const mongoose = require("mongoose");
const WasteSchema = require("../schemas/waste");

const WasteModel = mongoose.model("Waste", WasteSchema);

module.exports = WasteModel;