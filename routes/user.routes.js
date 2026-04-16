const express = require("express");
const router = express.Router();

const {
  registerUser,
  loginUser,
  sendOtp,
  verifyOtpAndRegister,
  logoutUser,
  getCurrentUser,
  deleteAccount
} = require("../controllers/user.controller.js");

const { protect } = require("../middleware/authMiddleware");

router.post("/register", registerUser);
router.post("/login", loginUser);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtpAndRegister);

router.post("/logout", logoutUser);

router.get("/current-user", getCurrentUser);

router.delete("/delete-account", protect, deleteAccount);

module.exports = router;
