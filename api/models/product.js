const mongoose = require('mongoose');
const ProductSchema = require('../schemas/product');

const ProductModel = mongoose.model('Product', ProductSchema);

module.exports = ProductModel;
