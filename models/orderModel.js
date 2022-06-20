const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  dateCreate: {
    type: Date,
    default: Date.now(),
  },
  paymentMethod: {
    type: String,
    required: [true, "It must be contained payment method for order bill"],
  },
  status: {
    type: String,
    default: "Active",
  },
  process: {
    type: String,
    default: "New",
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Model",
  },
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product_Model",
    },
  ],
});

module.exports = mongoose.model("Order_Model", orderSchema);
