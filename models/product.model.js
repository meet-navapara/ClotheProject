const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },

  description: String,

  //original price (actual price)
  originalPrice: {
    type: Number,
    required: true,
  },

  //final price (discount price)
  price: {
    type: Number,
    required: true,
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
  },

  brand: String,

  sizes: [String],

  image: [{
    url: String,
    public_id: String,
  }],

  stock: {
    type: Number,
    default: 0,
  },

  isBestSelling: {
    type: Boolean,
    default: false,
  },
  isSelling: {
    type: Boolean,
    default: false,
  },

}, { timestamps: true });

module.exports = mongoose.model("Product", productSchema);