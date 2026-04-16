const express = require("express");
const router = express.Router();

const {
  addAddress,
  getAddresses,
  updateAddress,
  deleteAddress,
} = require("../controllers/address.controller");

const { protect } = require("../middleware/authMiddleware");


// 🔐 all routes protected
router.post("/add-address", protect, addAddress);
router.get("/get-addresses", protect, getAddresses);
router.put("/update-address/:id", protect, updateAddress);
router.delete("/delete-address/:id", protect, deleteAddress);


module.exports = router;