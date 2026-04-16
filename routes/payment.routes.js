const express = require("express");
const router = express.Router();

const {
  createOrder,
  verifyPayment,
} = require("../controllers/payment.controller");

const { protect } = require("../middleware/authMiddleware");

// 🔥 create order
router.post("/create-order", protect, createOrder);

// 🔥 verify payment
router.post("/verify-payment", protect, verifyPayment);

module.exports = router;