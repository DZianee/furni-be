const mongoose = require("mongoose");
const finOrderSchema = require("./financeOrderSchema");

const financeSchema = new mongoose.Schema({
  year: {
    type: String,
  },
  revenue: {
    type: Number,
    default: 0,
  },
  rate: {
    type: String,
  },
  percent: {
    type: Number,
  },
  totalOrders: {
    type: Number,
  },
  order: [finOrderSchema],
});

module.exports = mongoose.model("Finance_Model", financeSchema);
