const Address = require("../models/address.model");

// 🔹 ADD ADDRESS
exports.addAddress = async (req, res) => {
  try {
    const userId = req.user.id; // from auth middleware

    const address = await Address.create({
      user: userId,
      ...req.body,
    });

    res.json({
      message: "Address added successfully",
      address,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET ALL ADDRESSES
exports.getAddresses = async (req, res) => {
  try {
    const userId = req.user.id;

    const addresses = await Address.find({ user: userId });

    res.json(addresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 UPDATE ADDRESS
exports.updateAddress = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user.id;
  
      const updated = await Address.findOneAndUpdate(
        { _id: id, user: userId }, // ✅ important
        req.body,
        { new: true }
      );
  
      if (!updated) {
        return res.status(404).json({
          message: "Address not found",
        });
      }
  
      res.json({
        message: "Address updated",
        address: updated,
      });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };

// 🔹 DELETE ADDRESS
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;

    await Address.findByIdAndDelete(id);

    res.json({
      message: "Address deleted",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};