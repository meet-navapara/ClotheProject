// const mongoose = require("mongoose");

// const userSchema = new mongoose.Schema(
//   {
//     name: {
//       type: String,
//       required: false,
//     },
//     email: {
//       type: String,
//       // required: false,
//       unique: true,
//       sparse: true // allow null values
//     },
//     password: {
//       type: String,
//       required: false,
//     },
//     mobile : {
//       type: String,
//       required: true,
//       unique: true,
//     },
//     isVerified : {
//       type: Boolean,
//       default: false,
//     }
//   },
//   { timestamps: true }
// );

// module.exports = mongoose.model("User", userSchema);




const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      trim: true,
    },
    lname: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      // required: false,
      unique: true,
      sparse: true, // allow null values
    },
    password: {
      type: String,
      required: false,
    },
    mobile: {
      type: String,
      required: true,
      unique: true,
    },
    gender: {
      type: String,
      enum: ["male", "female"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

module.exports = mongoose.model("User", userSchema);
