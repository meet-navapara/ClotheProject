const express = require("express");
const {
  addToCart,
  getCart,
  removeFromCart,
  updateCartItem,
} = require("../controllers/cart.controller");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/add-to-cart", protect, addToCart);
router.get("/get-cart", protect, getCart);


router.delete("/remove-from-cart/:id", protect, removeFromCart);   // 🔥 NEW
router.put("/update-cart/:productId", protect, updateCartItem);  // 🔥 NEW

module.exports = router;