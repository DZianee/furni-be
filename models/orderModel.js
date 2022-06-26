const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  dateCreate: {
    type: Date,
    default: Date.now(),
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
    }
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
        type: [String],
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
    },
  ],
});

orderSchema.index({
  user: "text",
  process: "text",
  status: "text",
  dateCreate: "text",
});


module.exports = mongoose.model("Order_Model", orderSchema);
