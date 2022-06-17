const mongoose = require("mongoose");

const roleSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Role name is required"],
    minlength: [5, "Role name must be at least 5 characters"],
  },
  status: {
    type: String,
    default: "Active",
  },
});

module.exports = mongoose.model("Role_Model", roleSchema);
