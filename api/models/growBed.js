const mongoose = require("mongoose");
const GrowBedSchema = require("../schemas/growBed");

const GrowBedModel = mongoose.model("GrowBed", GrowBedSchema)

module.exports = GrowBedModel;