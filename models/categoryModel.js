const mongoose = require("mongoose");

const categorySchema = new mongoose.Schema({
  code: {
    type: String,
    required: [true, "Category code is required"],
    minlength: [2, "Code must be at least 2 characters"],
    maxlength: [5, "Maximum for code is 5 characters"],
    uppercase: true,
  },
  name: {
    type: String,
    required: [true, "Category name is required to have"],
    minlength: [5, "It must be at least 5 characters"],
  },
  totalProduct: {
    type: Number,
  },
  productList: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product_Model",
    },
  ],
});

module.exports = mongoose.model("Category_Model", categorySchema);
