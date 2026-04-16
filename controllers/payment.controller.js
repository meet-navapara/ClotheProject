const razorpay = require("../utils/razorpay");
const crypto = require("crypto");
const Order = require("../models/order.model");
const Cart = require("../models/cart.model");

// 🔥 CREATE ORDER
exports.createOrder = async (req, res) => {
  try {
    const { amount, products, address, paymentMethod } = req.body;
    const userId = req.user?._id; // 🔥 auth middleware thi
    console.log("userId ----", userId);

    if (!amount || !products || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields required",
      });
    }

    // 🔥 RAZORPAY ORDER
    let razorpayOrder = null;

    if (paymentMethod === "CARD") {
      const options = {
        amount: amount * 100,
        currency: "INR",
        receipt: "receipt_" + Date.now(),
      };

      razorpayOrder = await razorpay.orders.create(options);
    }

    // 🔥 SAVE ORDER IN DB
    const newOrder = await Order.create({
      user: userId,
      address,
      products,
      totalAmount: amount,
      paymentMethod,
      paymentStatus: paymentMethod === "COD" ? "PENDING" : "PENDING",
      razorpay_order_id: razorpayOrder?.id || null,
    });
    console.log("newOrder ----", newOrder);

    // 🔥 ADD THIS FOR COD
    if (paymentMethod === "COD") {
      await Cart.deleteMany({ user: userId });
    }

    res.status(200).json({
      success: true,
      order: newOrder,
      razorpayOrder,
    });
  } catch (error) {
    console.error("CREATE ORDER ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Order creation failed",
    });
  }
};


exports.verifyPayment = async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;

    const body = razorpay_order_id + "|" + razorpay_payment_id;

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(body.toString())
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      return res.status(400).json({
        success: false,
        message: "Invalid signature",
      });
    }
    

    // 🔥 UPDATE ORDER IN DB
    const order = await Order.findOneAndUpdate(
      { razorpay_order_id },
      {
        paymentStatus: "SUCCESS",
        razorpay_payment_id,
        razorpay_signature,
      },
      { new: true },
    );

    // ✅ 🔥 ADD THIS LINE (MAIN FIX)
    await Cart.deleteMany({ user: order.user });
    console.log("Cart deleted for user:", order.user);

    res.status(200).json({
      success: true,
      message: "Payment verified successfully",
      order,
    });
  } catch (error) {
    console.error("VERIFY ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Verification failed",
    });
  }
};
