const express = require("express");
const {
  getProductById,
} = require("../controllers/productDetails.controller.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

// ➤ GET PRODUCT DETAILS
// router.get("/get-product-details/:id", protect, getProductById);
router.get("/get-product-details/:id", getProductById);

module.exports = router;