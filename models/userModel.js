const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    avatar: {
      type:String
    },
    name: {
      firstname: {
        type: String,
      },
      lastname: {
        type: String,
      },
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [7, "Password must have length at least 7 letters"],
    },
    phone: {
      type: String,
    },
    address: {
      street: {
        type: String,
      },
      ward: {
        type: String,
      },
      district: {
        type: String,
      },
      city: {
        type: String,
      },
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role_Models",
      required: [true, "Role is required"],
      default: "Default user",
    },
    status: {
      type: String,
      default: "Active",
    },
    order: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Order_Model",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User_Model", userSchema);
