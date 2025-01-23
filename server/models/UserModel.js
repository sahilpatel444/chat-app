const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "provide name"],
    },
    email: {
      type: String,
      required: [true, "provide email"],
      unique: true,
    },
    mobile_number: {
      type: Number,
      required: [true, "provide mobile number"],
      unique: true,
    },
    password: {
      type: String,
      required: [true, "provide password"],
    },
    profile_pic: {
      type: String,
      default : ""
    },
  },
  {
    timestamps: true,
  }
);

const UserSchema = mongoose.model("User", userSchema);

module.exports = UserSchema;
