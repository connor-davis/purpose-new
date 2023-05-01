const mongoose = require("mongoose");
const SaleSchema = require("../schemas/sale");

module.exports = mongoose.model("Sale", SaleSchema);