const express = require("express");
const router = express.Router();

const {
  getProfile,
  updateProfile,
  addProfile,
} = require("../controllers/profile.controller");

const { protect } = require("../middleware/authMiddleware");

// 🔹 PROFILE ROUTES
router.post("/add-profile", protect, addProfile);
router.get("/get-profile", protect, getProfile);
router.put("/update-profile", protect, updateProfile);

module.exports = router;