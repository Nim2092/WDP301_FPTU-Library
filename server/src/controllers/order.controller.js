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

    // Find the user first to check if the user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    // Find the orders for this user and populate the book and user details
    const orders = await Order.find({ created_by: userId })
      .populate({
        path: 'book_id', // Populate the book reference
        populate: {
          path: 'bookSet_id', // Nested populate to get the book set details
          model: 'BookSet',   // Reference to the BookSet model
        },
      })
      .populate('created_by', 'fullName')
      .populate('updated_by', 'fullName'); // Populate the user's full name

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "Order not found",
        data: null,
      });
    }

    // Return the orders along with populated data
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
      reason_order: "",
      renewalCount: 1,
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

async function changeOrderStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status } = req.body;

    if (typeof status !== 'number') {
      return res.status(400).json({ message: "Status must be a number." });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = status;
    await order.save();

    return res.status(200).json({ message: "Order status updated successfully", data: order });
  } catch (error) {
    console.error("Error changing order status", error);
    return res.status(500).json({ message: "An error occurred", error: error.message });
  }
}


async function renewOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { dueDate, renew_reason } = req.body;  // Extract renew_reason from the request body

    if (!dueDate) {
      return res.status(400).json({
        message: "Please provide a new due date."
      });
    }

    if (!renew_reason) {
      return res.status(400).json({
        message: "Please provide a reason for renewal."
      });
    }

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found."
      });
    }

    if (order.renewalCount >= 3) {
      return res.status(400).json({
        message: "Order cannot be renewed more than 3 times."
      });
    }

    order.dueDate = dueDate;
    order.renewalCount += 1;
    order.renewalDate = new Date();
    order.renew_reason = renew_reason;  // Update the renew_reason field

    await order.save();

    return res.status(200).json({
      message: "Order renewed successfully.",
      data: order
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message
    });
  }
}




const OrderController = {
  getOrderByUserId,
  getAllOrder,
  getOrderById,
  createBorrowOrder,
  changeOrderStatus,
  renewOrder
};
module.exports = OrderController;
