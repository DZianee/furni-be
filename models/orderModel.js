const mongoose = require("mongoose");
const cartSchema = require("./cartSchema");

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    required: true,
  },
  dateCreate: {
    type: Date,
  },
  dateClose: {
    type: Date,
  },
  totalBill: {
    type: Number,
    required: [true, "The order has to deliver a total's bill"],
  },
  payment: {
    transactionID: {
      type: String,
    },
    paymentMethod: {
      type: String,
      required: [true, "It must be contained payment method for order bill"],
    },
    payStatus: {
      type: String,
      default: "Unpaid",
    },
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
  cart: {
    type: [Object],
  },
});

orderSchema.index({
  orderId: "text",
  transactionID: "text",
  user: "text",
  process: "text",
  status: "text",
  dateCreate: "text",
});

module.exports = mongoose.model("Order_Model", orderSchema);
