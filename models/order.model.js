const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
      required: true,
    },

    address: {
      type: mongoose.Schema.Types.ObjectId,
      // ref: "addresses",
      ref: "Address",
      required: true,
    },

    products: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: Number,
        size: String,
      },
    ],

    totalAmount: {
      type: Number,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "CARD"],
      required: true,
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "SUCCESS", "FAILED"],
      default: "PENDING",
    },

    orderStatus: {
      type: String,
      // enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
      enum: [
        "PLACED",
        "CONFIRMED",
        "PREPARING",
        "PICKED",
        "DELIVERED",
        "CANCELLED",
        "RETURNED",
      ],
      default: "PLACED",
    },
    
    deliveryDate: {
      type: Date,
    },

    razorpay_order_id: String,
    razorpay_payment_id: String,
    razorpay_signature: String,
  },
  { timestamps: true },
);

module.exports = mongoose.model("orders", orderSchema);
