const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, order: Order, book: Book } = db;

//Get all order
const getAllOrder = async (req, res, next) => {
  try {
    const order = await Order.find({});

    if (!order || order.length === 0) {
      return res.status(404).json({
        message: "Get all order failed",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get all order successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error listing order", error);
    res.status(500).send({ message: error.message });
  }
};

//Get order by id
const getOrderById = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get order successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error getting a order", error);
    res.status(500).send({ message: error.message });
  }
};

//Get orders by user id
const getOrderByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    const orders = await Order.find({ created_by: userId });
    console.log(orders);
    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get order successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error getting a order", error);
    res.status(500).send({ message: error.message });
  }
};

//create borrow order with book id
const createBorrowOrder = async (req, res, next) => {
  try {
    const { borrowDate, dueDate, userId } = req.body;
    const { bookId } = req.params;

    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
        data: null,
      });
    }

    const order = new Order({
      book_id: bookId,
      created_by: userId /* req.user.id */,
      updated_by: userId /* req.user.id */,
      status: 1,
      requestDate: new Date(),
      borrowDate,
      dueDate,
      returnDate: null,
      reason_order: "Borrowing",
      renewalCount: 0,
      renewalDate: null,
    });

    const newOrder = await order.save();

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).send({ message: error.message });
  }
};

const OrderController = {
  getOrderByUserId,
  getAllOrder,
  getOrderById,
  createBorrowOrder,
};
module.exports = OrderController;
