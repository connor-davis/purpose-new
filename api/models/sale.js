const mongoose = require("mongoose");
const SaleSchema = require("../schemas/sale");

const SaleModel = mongoose.model("Sale", SaleSchema);

module.exports = SaleModel;