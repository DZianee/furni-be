const mongoose = require("mongoose");

const finOrderSchema = new mongoose.Schema({
  month: {
    type: String,
    uppercase: true,
  },
  orderID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Order_Model",
    required: true,
  },
  order_id: { type: String, required: true },
  process: { type: String },
  totalBill: { type: Number },
  payment: { type: String },
});

module.exports = finOrderSchema;
