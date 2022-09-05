const mongoose = require("mongoose");
const reviewSchema = require("./reviewSchema");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      uppercase: true,
      required: [true, "Product name is required"],
      minlength: [10, "Product name length must be at least 10 characters"],
    },
    code: {
      type: String,
      uppercase: true,
      required: [true, "Product code is required"],
    },
    productImg: {
      type: String,
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
    },
    importQuantity: {
      type: Number,
      min: [1, "Min quantity must be at least 1"],
      required: [true, "Product import quantity is required"],
    },
    exportQuantity: {
      type: Number,
      default: 0,
    },
    color: [
      {
        type: String,
        required: [true, "Product color is required"],
      },
    ],
    status: {
      type: String,
      default: "IN STOCK",
    },
    type: {
      type: String,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    about: {
      type: String,
      required: [true, "About product is required"],
    },
    technicalInfo: {
      width: {
        type: Number,
        required: [true, "Width technical is required"],
      },
      height: {
        type: Number,
        required: [true, "Height technical is required"],
      },
      depth: {
        type: Number,
        required: [true, "Depth technical is required"],
      },
      length: {
        type: Number,
        required: [true, "Length technical is required"],
      },
    },
    category: {
      type: String,
    },
    review: [reviewSchema],
    countReviews: {
      type: Number,
    },
  },
  {
    timestamps: true,
  }
);

productSchema.index({
  name: "text",
  code: "text",
  type: "text",
  status: "text",
});

module.exports = mongoose.model("Product_Model", productSchema);
