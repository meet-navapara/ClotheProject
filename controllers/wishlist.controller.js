const Wishlist = require("../models/wishlist.model");

// 🔹 ADD TO WISHLIST
exports.addToWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.body;

    let wishlist = await Wishlist.findOne({ user: userId });

    // create if not exists
    if (!wishlist) {
      wishlist = new Wishlist({
        user: userId,
        products: [],
      });
    }

    // prevent duplicate
    if (!wishlist.products.includes(productId)) {
      wishlist.products.push(productId);
    }

    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 🔹 GET WISHLIST
exports.getWishlist = async (req, res) => {
  try {
    const userId = req.user.id;

    const wishlist = await Wishlist.findOne({ user: userId }).populate("products");

    res.json(wishlist || { products: [] });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// 🔹 REMOVE FROM WISHLIST
exports.removeFromWishlist = async (req, res) => {
  try {
    const userId = req.user.id;
    const { productId } = req.params;

    const wishlist = await Wishlist.findOne({ user: userId });

    if (!wishlist) {
      return res.status(404).json({ message: "Wishlist not found" });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};