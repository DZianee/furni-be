const mongoose = require("mongoose");

const reactSchema = new mongoose.Schema({
  like: {
    type: Number,
    default: 0,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User_Model",
    required: true
  },
});

module.exports = reactSchema;
