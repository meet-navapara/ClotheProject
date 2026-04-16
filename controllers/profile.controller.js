const User = require("../models/user.model");


// 🔹 ADD PROFILE
exports.addProfile = async (req, res) => {
    try {
      const { fname, lname, email, gender } = req.body;
  
      const user = await User.findById(req.user._id);
  
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // ❗ Check if already exists
      if (user.fname || user.email) {
        return res.status(400).json({
          message: "Profile already exists, use update API",
        });
      }
  
      // 🔥 ADD DATA
      user.fname = fname;
      user.lname = lname;
      user.email = email;
      user.gender = gender;
  
      await user.save();
  
      res.status(201).json({
        success: true,
        user,
      });
  
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// 🔹 GET PROFILE
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 UPDATE PROFILE (ADD + EDIT)
exports.updateProfile = async (req, res) => {
  try {
    const { fname, lname, email, gender } = req.body;

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.fname = fname || user.fname;
    user.lname = lname || user.lname;
    user.email = email || user.email;
    user.gender = gender || user.gender;

    await user.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};