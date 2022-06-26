const mongoose = require("mongoose");
const reactSchema = require("./likeSchema");

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: true
  },
  dateCreated: {
    type: Date,
    default: Date.now(),
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Model",
    required: true
  },
  rating: {
    type: String,
    default: "EXCELLENT",
  },
  like: [reactSchema],
  countReact: {
    type: Number,
  },
});

module.exports = reviewSchema;
