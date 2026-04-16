const mongoose = require("mongoose");

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: String,
    mobile: String,

    house: String,
    area: String,
    pincode: String,
    city: String,
    state: String,
    landmark: String,

    addressType: {
      type: String,
      enum: ["HOME", "OFFICE"],
      default: "HOME",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", addressSchema);