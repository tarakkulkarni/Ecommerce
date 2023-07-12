const Order = require("../models/order");

const getUserOrders = async (req, res) => {
  try {
    const orders = await Order.find({ buyer: req.user._id })
      .populate("products", "-photo")
      .populate("buyer", "name");
    res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting user's orders",
    });
  }
};
const getAdminOrders = async (req, res) => {
  try {
    const orders = await Order.find({})
      .populate("products", "-photo")
      .populate("buyer", "name")
      .sort({ createdAt: "-1" });
    res.status(200).send({
      success: true,
      orders,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      error,
      message: "Error in getting admin orders",
    });
  }
};
const orderStatusController = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { status } = req.body;
    const orders = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true }
    );
    res.json(orders);
  } catch (error) {
    console.log(error);
    res.status(500).send({
      error,
      message: "Error in updating order status",
    });
  }
};
module.exports = {
  getUserOrders,
  getAdminOrders,
  orderStatusController,
};
