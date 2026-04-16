const User = require("../models/user.model.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Otp = require("../models/otp.model");

const Cart = require("../models/cart.model");
const Order = require("../models/order.model");
const Address = require("../models/address.model");



// 🔹 Register
exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
      expiresIn: "7d",
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 Login
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
        expiresIn: "7d",
      });

      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token,
      });
    } else {
      res.status(401).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//otp send
exports.sendOtp = async (req, res) => {
  const { mobile } = req.body;

  // ✅ Validation
  const mobileRegex = /^[0-9]{10}$/;

  if (!mobile || !mobileRegex.test(mobile)) {
    return res.status(400).json({
      message: "Mobile number must be exactly 10 digits",
    });
  }

  //old otp delete
  await Otp.deleteMany({ mobile });

  // generate 6 digit otp
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  console.log("before OTP save:", otp); // 🔥 for testing
  // save in DB
  await Otp.create({
    mobile,
    otp,
    expiresAt: new Date(Date.now() + 5 * 60 * 1000), // 5 min ma expire otp
  });

  console.log("OTP:", otp); // 🔥 for testing

  res.json({ message: "OTP sent successfully" });
};


exports.verifyOtpAndRegister = async (req, res) => {
  const { mobile, otp } = req.body;

  try {
    const record = await Otp.findOne({ mobile, otp });

    if (!record) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (record.expiresAt < new Date()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    let user = await User.findOne({ mobile });

    // 🔥 FIX: create user if not exists
    if (!user) {
      user = await User.create({
        mobile,
        isVerified: true,
      });
    }

    // 🔐 token
    const token = jwt.sign({ id: user._id }, "SECRET_KEY", {
      expiresIn: "7d",
    });

    await Otp.deleteMany({ mobile });

    res.json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.logoutUser = async (req, res) => {
  try {
    // token from header
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(400).json({ message: "No token provided" });
    }

    // (Optional) blacklist logic add kari sako — currently simple logout
    return res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




// 🔹 GET CURRENT USER (VERY IMPORTANT)
exports.getCurrentUser = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "No token" });
    }

    // verify token
    const decoded = jwt.verify(token, "SECRET_KEY");

    // get user
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      success: true,
      user,
    });

  } catch (error) {
    res.status(401).json({ message: "Invalid token" });
  }
};



//delete account --user delete

exports.deleteAccount = async (req, res) => {
  try {
    const userId = req.user._id;

    // 🔥 DELETE RELATED DATA
    await Cart.deleteMany({ user: userId });
    await Order.deleteMany({ user: userId });
    await Address.deleteMany({ user: userId });

    // 🔥 DELETE USER
    await User.findByIdAndDelete(userId);

    res.status(200).json({
      success: true,
      message: "Account deleted successfully",
    });
  } catch (error) {
    console.error("DELETE ACCOUNT ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete account",
    });
  }
};


