const Order = require("../models/order.model");

// 🔥 GET USER ORDERS
exports.getMyOrders = async (req, res) => {
  try {
    const userId = req.user._id;

    const orders = await Order.find({ user: userId })
      .populate("address") // 🔥 address details
      .populate("products.product") // 🔥 product details
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      orders,
    });
  } catch (error) {
    console.error("GET ORDERS ERROR:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch orders",
    });
  }
};


//CANCEL ORDER
exports.cancelOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (!order) return res.status(404).json({ message: "Not found" });

  order.orderStatus = "CANCELLED";

  await order.save();

  res.json({ success: true, order });
};


//RETURN ORDER
exports.returnOrder = async (req, res) => {
  const order = await Order.findById(req.params.id);

  order.orderStatus = "RETURNED";

  await order.save();

  res.json({ success: true, order });
};


//STATUS UPDATE admin can update the status in backend 
exports.updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 🔥 UPDATE STATUS
    order.orderStatus = status;

    // 🔥 ADD DELIVERY DATE HERE
    if (status === "DELIVERED") {
      order.deliveryDate = new Date();
    }

    await order.save();

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};