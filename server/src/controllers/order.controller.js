const { default: mongoose } = require("mongoose");
const db = require("../models");
const {
  user: User,
  role: Role,
  order: Order,
  book: Book,
  bookset: BookSet,
  notification: Notification,
  penaltyreason: PenaltyReason,
  fines: Fines,
} = db;

//Get all order
const getAllOrder = async (req, res, next) => {
  try {
    const order = await Order.find({}).populate({
      path: "book_id", // Populate the book reference
      populate: {
        path: "bookSet_id", // Nested populate to get the book set details
        model: "BookSet", // Reference to the BookSet model
      },
    });

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
    const { orderId } = req.params; // Extract orderId from request params

    // Check if orderId is valid before proceeding
    if (!mongoose.Types.ObjectId.isValid(orderId)) {
      return res.status(400).json({ message: "Invalid Order ID" });
    }

    // Find the order by ID and populate the related fields (book_id, created_by, updated_by)
    const order = await Order.findById(orderId)
      .populate({
        path: "book_id", // Populate the book reference
        populate: {
          path: "bookSet_id", // Nested populate to get the book set details
          model: "BookSet", // Reference to the BookSet model
        },
      })
      .populate("created_by", "fullName") // Populate the creator's full name
      .populate("updated_by", "fullName"); // Populate the updater's full name

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Return the order with the populated data
    res.status(200).json({
      message: "Get order successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error getting the order", error);
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
        path: "book_id", // Populate the book reference
        populate: {
          path: "bookSet_id", // Nested populate to get the book set details
          model: "BookSet", // Reference to the BookSet model
        },
      })
      .populate("created_by", "fullName")
      .populate("updated_by", "fullName"); // Populate the user's full name

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

    console.log(req.body);
    console.log(req.params);
    //check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    //check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
        data: null,
      });
    }

    //check if book set exists and has available copies
    const bookSet = await BookSet.findById(book.bookSet_id);
    if (!bookSet || bookSet.availableCopies < 1) {
      return res.status(400).json({
        message: "No available copies left for this book set",
        data: null,
      });
    }

    //check if the book is already borrowed or reserved by another user
    const existingOrder = await Order.findOne({
      book_id: bookId,
      status: {
        $in: ["Pending", "Approved", "Received", "Overdue", "Renew Pending"],
      },
    });

    if (existingOrder) {
      return res.status(400).json({
        message: "This book is already borrowed or reserved by another user",
        data: null,
      });
    }

    //check if borrow date and due date are valid
    if (!borrowDate || !dueDate) {
      return res.status(400).json({
        message: "Borrow date and due date are required",
        data: null,
      });
    }

    const borrowDateObj = new Date(borrowDate);
    const dueDateObj = new Date(dueDate);

    if (isNaN(borrowDateObj.getTime()) || isNaN(dueDateObj.getTime())) {
      return res.status(400).json({
        message: "Invalid borrow date or due date",
        data: null,
      });
    }

    if (dueDateObj <= borrowDateObj) {
      return res.status(400).json({
        message: "Due date must be after borrow date",
        data: null,
      });
    }

    //create new order
    const order = new Order({
      book_id: bookId,
      created_by: userId,
      updated_by: userId,
      status: "Pending",
      requestDate: new Date(),
      borrowDate: borrowDateObj,
      dueDate: dueDateObj,
      returnDate: null,
      reason_order: "",
      renewalCount: 0,
      renewalDate: null,
    });

    const newOrder = await order.save();

    book.status = "Borrowed";
    await book.save();

    bookSet.availableCopies -= 1;
    await bookSet.save();

    const notification = new Notification({
      userId: userId,
      type: "Borrow",
      message: `Bạn đã yêu cầu mượn sách thành công. Vui lòng đến lấy sách đúng ngày. Hạn trả là ngày ${dueDateObj.toDateString()}.`,
    });

    await notification.save();

    res.status(201).json({
      message: "Order created successfully",
      data: newOrder,
    });
  } catch (error) {
    console.error("Error creating order", error);
    res.status(500).send({ message: error.message });
  }
};

// change order status
async function changeOrderStatus(req, res, next) {
  try {
    const { orderId } = req.params;
    const { status, reason_order, updated_by } = req.body;

    // Find the order by ID
    const order = await Order.findById(orderId).populate(
      "created_by",
      "fullName email"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Validate status
    const validStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Received",
      "Canceled",
      "Returned",
      "Overdue",
      "Lost",
      "Renew Pending",
    ];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status update." });
    }

    // Handle rejection with reason
    if (status === "Rejected") {
      if (!reason_order || reason_order.trim() === "") {
        return res
          .status(400)
          .json({ message: "Rejection reason is required." });
      }
      order.reason_order = reason_order; // Set the reason for rejection
    }

    // Update the order status
    order.status = status;
    order.updated_by = updated_by;

    // Save the updated order
    await order.save();

    // Determine the notification type based on the status
    let notificationType = "Status Change";
    let notificationMessage = `Your order #${order._id} status has been changed to ${status}.`;

    if (status === "Approved") {
      notificationType = "Approved"; // Set notification type to "Approval" for approved status
      notificationMessage = `Your order #${order._id} has been approved.`;
    } else if (status === "Rejected") {
      notificationType = "Rejected"; // Set notification type to "Rejected" for rejected status
      notificationMessage = `Your order #${order._id} has been rejected. Reason: ${reason_order}.`;
    }

    // Create a notification for the user who created the order
    const notification = new Notification({
      userId: order.created_by._id,
      type: notificationType,
      message: notificationMessage,
    });

    await notification.save();

    return res.status(200).json({
      message: "Order status updated successfully",
      data: order,
    });
  } catch (error) {
    console.error("Error changing order status", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

// Renew order
async function renewOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { dueDate, renew_reason, userId } = req.body;

    if (!dueDate) {
      return res.status(400).json({
        message: "Please provide a new due date.",
      });
    }

    if (!renew_reason) {
      return res.status(400).json({
        message: "Please provide a reason for renewal.",
      });
    }

    const order = await Order.findById(orderId).populate(
      "book_id",
      "identifier_code condition"
    );
    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.renewalCount >= 3) {
      return res.status(400).json({
        message: "Order cannot be renewed more than 3 times.",
      });
    }

    order.dueDate = dueDate;
    order.renewalCount += 1;
    order.renewalDate = new Date();
    order.renew_reason = renew_reason; // Update the renew_reason field

    await order.save();

    const notification = new Notification({
      userId: userId,
      type: "Renewal",
      message: `Bạn đã gia hạn thành công sách #${order.book_id.identifier_code}. Ngày trả mới là ${dueDate}.`,
    });

    await notification.save();

    return res.status(200).json({
      message: "Order renewed successfully.",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

// Return order
async function returnOrder(req, res, next) {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await Order.findById(orderId).populate(
      "book_id",
      "identifier_code condition"
    );
    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.returnDate) {
      return res.status(400).json({
        message: "Book has already been returned.",
      });
    }

    order.status = "Returned";
    order.returnDate = new Date();

    await order.save();

    const notification = new Notification({
      userId: userId,
      type: "Return",
      message: `Bạn đã trả thành công sách #${order.book_id.identifier_code}. Tình trạng sách là: ${order.book_id.condition}. Cảm ơn!`,
    });

    await notification.save();

    return res.status(200).json({
      message: "Order returned successfully.",
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
}

//filter order by status
const filterOrdersByStatus = async (req, res, next) => {
  try {
    const { status } = req.query;

    const validStatuses = [
      "Pending",
      "Approved",
      "Rejected",
      "Received",
      "Canceled",
      "Returned",
      "Overdue",
      "Lost",
      "Renew Pending",
    ];

    // Check invalid status
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Please provide a valid order status.",
      });
    }

    // Find orders by status and populate the related fields
    const orders = await Order.find({ status })
      .populate("book_id", "title")
      .populate("created_by", "name email")
      .populate("updated_by", "name email");

    if (!orders || orders.length === 0) {
      return res.status(404).json({
        message: "No orders found with the provided status.",
        data: null,
      });
    }

    return res.status(200).json({
      message: `Orders with status '${status}' retrieved successfully.`,
      data: orders,
    });
  } catch (error) {
    console.error("Error filtering orders by status", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

//Cancel order
const cancelOrder = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await Order.findById(orderId).populate(
      "book_id",
      "identifier_code"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Check if the order is in a cancelable state
    if (order.status !== "Pending") {
      return res.status(400).json({
        message: `Order cannot be canceled. Current status: ${order.status}`,
      });
    }

    order.status = "Canceled";
    order.updated_by = userId;
    await order.save();

    //create notification
    const notification = new Notification({
      userId: userId,
      type: "Canceled",
      message: `Bạn đã hủy thành công sách #${order.book_id.identifier_code}.`,
    });
    await notification.save();

    return res.status(200).json({
      message: "Order canceled successfully.",
      data: order,
    });
  } catch (error) {
    console.error("Error canceling order", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

//Report lost book
const reportLostBook = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId } = req.body;

    const order = await Order.findById(orderId).populate(
      "book_id",
      "identifier_code condition"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    order.status = "Lost";
    await order.save();

    // Create notification
    const notification = new Notification({
      userId: userId,
      type: "Lost",
      message: `Sách ${order.book_id.identifier_code} đã được báo cáo là bị mất.`,
    });
    await notification.save();

    return res.status(200).json({
      message: `Báo cáo sách bị mất thành công.`,
      data: order,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

//Approve fines for lost book
const applyFinesForLostBook = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId, fineReasonId, createBy, updateBy } = req.body;

    const order = await Order.findById(orderId).populate(
      "book_id",
      "identifier_code"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }

    // Check status of the order
    if (order.status !== "Lost") {
      return res.status(400).json({
        message: "This order is not reported as lost.",
      });
    }

    //check penalty reason
    const penaltyReason = await PenaltyReason.findById(fineReasonId).populate(
      "reasonName"
    );
    if (!penaltyReason) {
      return res.status(404).json({ message: "Penalty reason not found" });
    }

    // Create new fine record for lost book
    const fines = new Fines({
      user_id: userId,
      order_id: orderId,
      fineReason_id: fineReasonId,
      createBy: createBy,
      updateBy: updateBy,
      totalFineAmount: penaltyReason.penaltyAmount,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethod: null,
      paymentDate: null,
    });

    await fines.save();

    // Create notification for the user
    const notification = new Notification({
      userId: userId,
      type: "Fines",
      message: `Bạn đã bị phạt ${penaltyReason.penaltyAmount}k cho sách ${order.book_id.identifier_code} vì bị mất.`,
    });
    await notification.save();

    return res.status(200).json({
      message: `Applied fines for lost book successfully.`,
      data: fines,
    });
  } catch (error) {
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};

const OrderController = {
  getOrderByUserId,
  getAllOrder,
  getOrderById,
  createBorrowOrder,
  changeOrderStatus,
  renewOrder,
  returnOrder,
  filterOrdersByStatus,
  cancelOrder,
  reportLostBook,
  applyFinesForLostBook,
};
module.exports = OrderController;
