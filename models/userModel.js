const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    lastLogin: {
      type: Date,
    },
    avatar: {
      type: String,
    },
    firstname: {
      type: String,
    },
    lastname: {
      type: String,
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
      unique: true,
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
      ref: "Role_Model",
      required: [true, "Role is required"],
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

userSchema.index({
  firstname: "text",
  lastname: "text",
  email: "text",
  phone: "text",
  status: "text",
});

const User_Model = mongoose.model("User_Model", userSchema);

module.exports = User_Model;
