const mongoose = require("mongoose");
const ProduceSchema = require("../schemas/produce");

module.exports = mongoose.model("Produce", ProduceSchema);