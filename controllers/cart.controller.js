const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

// ➤ ADD TO CART
exports.addToCart = async (req, res) => {
  try {
    const { productId, quantity = 1, size } = req.body;
    const userId = req.user;

    const productData = await Product.findById(productId);

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Cart.findOne({ user: userId });

    // 🆕 CREATE CART
    if (!cart) {
      if (quantity > productData.stock) {
        return res.status(400).json({
          message: `Only ${productData.stock} items available`,
        });
      }

      cart = await Cart.create({
        user: userId,
        products: [{ product: productId, quantity, size }],
      });
    } else {
      const index = cart.products.findIndex(
        (p) => p.product.toString() === productId
      );

      // 🔁 UPDATE EXISTING
      if (index > -1) {
        const newQty = cart.products[index].quantity + quantity;

        if (newQty > productData.stock) {
          return res.status(400).json({
            message: `Only ${productData.stock} items available`,
          });
        }

        cart.products[index].quantity = newQty;
      } else {
        // ➕ ADD NEW PRODUCT
        if (quantity > productData.stock) {
          return res.status(400).json({
            message: `Only ${productData.stock} items available`,
          });
        }

        cart.products.push({ product: productId, quantity, size });
      }

      await cart.save();
    }

    res.status(200).json({
      message: "Product added to cart",
      products: cart.products,
      cart,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ➤ GET CART
exports.getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user }).populate(
      "products.product"
    );

    res.status(200).json({
      products: cart?.products || [],
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




// ➤ REMOVE FROM CART 🔥
exports.removeFromCart = async (req, res) => {
  try {
    const { id } = req.params;

    let cart = await Cart.findOne({ user: req.user });
    console.log(cart,"cart");
    console.log(id,"id----for the cart");

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    cart.products = cart.products.filter(
      (item) => !item.product.equals(id)
    );

    await cart.save();

    res.status(200).json({
      message: "Product removed",
      products: cart.products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ➤ UPDATE CART ITEM (SIZE + QUANTITY) 🔥
exports.updateCartItem = async (req, res) => {
  try {
    const { productId } = req.params;
    const { quantity, size } = req.body;

    // 🔹 check product
    const productData = await Product.findById(productId);

    if (!productData) {
      return res.status(404).json({ message: "Product not found" });
    }

    // 🔹 stock validation
    if (quantity > productData.stock) {
      return res.status(400).json({
        message: `Only ${productData.stock} items available`,
      });
    }

    // 🔹 find cart
    let cart = await Cart.findOne({ user: req.user });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    // 🔹 find item
    const item = cart.products.find(
      (p) => p.product.toString() === productId
    );

    if (!item) {
      return res.status(404).json({ message: "Item not in cart" });
    }

    // 🔥 UPDATE BOTH
    item.quantity = quantity;
    item.size = size;

    await cart.save();

    // 🔥 return updated cart (important)
    const updatedCart = await Cart.findOne({ user: req.user }).populate(
      "products.product"
    );

    res.status(200).json({
      message: "Cart updated successfully",
      products: updatedCart.products,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};