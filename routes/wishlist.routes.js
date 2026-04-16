const express = require("express");
const {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} = require("../controllers/wishlist.controller.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// 🔒 Protected Routes
router.post("/add-to-wishlist", protect, addToWishlist);
router.get("/get-wishlist", protect, getWishlist);
router.delete("/remove-from-wishlist/:productId", protect, removeFromWishlist);

module.exports = router;