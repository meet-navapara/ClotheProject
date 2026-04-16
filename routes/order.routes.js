const express = require("express");
const router = express.Router();

const {
  getMyOrders,
  cancelOrder,
  returnOrder,
  updateOrderStatus,
} = require("../controllers/order.controller");
const { protect } = require("../middleware/authMiddleware");

// 🔥 USER ORDERS
router.get("/my-orders", protect, getMyOrders);

router.put("/cancel-order/:id", protect, cancelOrder);

router.put("/return-order/:id", protect, returnOrder);

router.put("/update-order-status/:id", protect, updateOrderStatus);

module.exports = router;
