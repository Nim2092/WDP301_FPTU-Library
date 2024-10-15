const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, order: Order } = db;

//Get user orders by user id (book_id, created_by, updated_by)
const getOrderByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const order = await Order.find({
      $or: [{ created_by: userId }, { updated_by: userId }],
    })
      .populate("book_id")
      .populate("created_by")
      .populate("updated_by");

    if (!order || order.length === 0) {
      return res.status(404).json({
        message: "No order found for this user!",
        data: null,
      });
    }

    res.status(200).json({
      message: "Order found successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error in getUserOrder:", error);
    res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
    next(error);
  }
};

const OrderController = { getOrderByUserId };
module.exports = OrderController;
