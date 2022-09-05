const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product_Model",
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
  productImg: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
});
module.exports = cartSchema;
