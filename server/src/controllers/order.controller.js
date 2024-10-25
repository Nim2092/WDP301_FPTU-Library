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
const cron = require("node-cron");

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
const getOrderByIdentifierCode = async (req, res, next) => {
  try {
    const { identifierCode } = req.params; // Lấy identifier_code từ tham số yêu cầu

    // Tìm sách theo identifier_code
    console.log(identifierCode);
    const book = await Book.findOne({ identifier_code: identifierCode });

    // Kiểm tra xem sách có tồn tại không
    if (!book) {
      return res.status(404).json({ message: "Book not found" });
    }

    // Tìm đơn hàng dựa vào book_id
    const order = await Order.findOne({ book_id: book._id })
        .populate({
          path: "book_id", // Populating the book reference
          populate: {
            path: "bookSet_id", // Nested populate to get book set details
            model: "BookSet", // Reference to the BookSet model
          },
        })
        .populate("created_by", "fullName") // Populate the creator's full name
        .populate("updated_by", "fullName"); // Populate the updater's full name

    // Kiểm tra xem đơn hàng có tồn tại không
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Trả về thông tin đơn hàng đã tìm thấy
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
      return res.status(200).json({
        message: "Order not found",
        data: [],
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
// const createBorrowOrder = async (req, res, next) => {
//   try {
//     const { borrowDate, dueDate, userId } = req.body;
//     const { bookId } = req.params;

//     console.log(req.body);
//     console.log(req.params);
//     //check if user exists
//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     //check if book exists
//     const book = await Book.findById(bookId);
//     if (!book) {
//       return res.status(404).json({
//         message: "Book not found",
//         data: null,
//       });
//     }

//     //check if book set exists and has available copies
//     const bookSet = await BookSet.findById(book.bookSet_id);
//     if (!bookSet || bookSet.availableCopies < 1) {
//       return res.status(400).json({
//         message: "No available copies left for this book set",
//         data: null,
//       });
//     }

//     //check if the book is already borrowed or reserved by another user
//     const existingOrder = await Order.findOne({
//       book_id: bookId,
//       status: {
//         $in: ["Pending", "Approved", "Received", "Overdue", "Renew Pending"],
//       },
//     });

//     if (existingOrder) {
//       return res.status(400).json({
//         message: "This book is already borrowed or reserved by another user",
//         data: null,
//       });
//     }

//     //check if borrow date and due date are valid
//     if (!borrowDate || !dueDate) {
//       return res.status(400).json({
//         message: "Borrow date and due date are required",
//         data: null,
//       });
//     }

//     const borrowDateObj = new Date(borrowDate);
//     const dueDateObj = new Date(dueDate);

//     if (isNaN(borrowDateObj.getTime()) || isNaN(dueDateObj.getTime())) {
//       return res.status(400).json({
//         message: "Invalid borrow date or due date",
//         data: null,
//       });
//     }

//     if (dueDateObj <= borrowDateObj) {
//       return res.status(400).json({
//         message: "Due date must be after borrow date",
//         data: null,
//       });
//     }

//     //create new order
//     const order = new Order({
//       book_id: bookId,
//       created_by: userId,
//       updated_by: userId,
//       status: "Pending",
//       requestDate: new Date(),
//       borrowDate: borrowDateObj,
//       dueDate: dueDateObj,
//       returnDate: null,
//       reason_order: "",
//       renewalCount: 0,
//       renewalDate: null,
//     });

//     const newOrder = await order.save();

//     book.status = "Borrowed";
//     await book.save();

//     bookSet.availableCopies -= 1;
//     await bookSet.save();

//     const notification = new Notification({
//       userId: userId,
//       type: "Borrow",
//       message: `Bạn đã yêu cầu mượn sách thành công. Vui lòng đến lấy sách đúng ngày. Hạn trả là ngày ${dueDateObj.toDateString()}.`,
//     });

//     await notification.save();

//     res.status(201).json({
//       message: "Order created successfully",
//       data: newOrder,
//     });
//   } catch (error) {
//     console.error("Error creating order", error);
//     res.status(500).send({ message: error.message });
//   }
// };

const createBorrowOrder = async (req, res, next) => {
  try {
    const { borrowDate, dueDate, userId } = req.body;
    const { bookId } = req.params;

    console.log(req.body);
    console.log(req.params);

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if book exists
    const book = await Book.findById(bookId);
    if (!book) {
      return res.status(404).json({
        message: "Book not found",
        data: null,
      });
    }
    if(book.status !== 'Available') {
      return res.status(500).json({
        message: "Book is borrowed or is not good enough to borrow.",
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

    // Check if borrow date and due date are valid
    if (!borrowDate || !dueDate) {
      return res.status(400).json({
        message: "Borrow date and due date are required",
        data: null,
      });
    }

    const borrowDateObj = new Date(borrowDate);
    const dueDateObj = new Date(dueDate);

    const differenceInDays =
      (dueDateObj - borrowDateObj) / (1000 * 60 * 60 * 24);

    if (differenceInDays > 14) {
      return res.status(400).json({
        message: "The maximum term for borrowing books is 14 days",
        data: null,
      });
    }

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

    // Check if due date is more than 14 days after borrow date
    const maxDueDate = new Date(borrowDateObj);
    maxDueDate.setDate(maxDueDate.getDate() + 14); // Add 14 days

    if (dueDateObj > maxDueDate) {
      return res.status(400).json({
        message: "Due date must not be more than 14 days after the borrow date",
        data: null,
      });
    }

    // Create new order
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
      type: "Pending",
      message: `You have successfully requested to borrow the book. Your book loan is due today ${dueDateObj.toDateString()}.`,
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
    const order = await Order.findById(orderId)
      .populate("created_by", "fullName email")
      .populate("book_id", "identifier_code condition");

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

    // Check if the order is overdue or lost and the status is being changed to Renew Pending
    if (
      status === "Renew Pending" &&
      (order.status === "Lost" || order.status === "Overdue")
    ) {
      return res
        .status(400)
        .json({ message: "Lost or overdue books cannot be renewed" });
    }

    //Check can not renew a returned order
    if (order.status === "Returned" && status === "Renew Pending") {
      return res.status(400).json({
        message: "Cannot renew a returned order",
      });
    }

    //Check just orders with status Pending or Renew Pending can be cancel
    const cancelableStatuses = ["Pending", "Renew Pending"];
    if (status === "Canceled" && !cancelableStatuses.includes(status)) {
      return res.status(400).json({
        message: `Just orders with status ${cancelableStatuses.join(
          " or "
        )} can be cancel.`,
      });
    }

    //Order cancellation limits
    const user = order.created_by;
    if (status === "Canceled") {
      if (user.cancelCount >= 3) {
        return res.status(400).json({
          message: "You have reached the maximum number of cancellations.",
        });
      }
      user.cancelCount += 1;
      await user.save();
    }


    // Update the order status
    order.status = status;
    order.updated_by = updated_by;

    // Save the updated order
    await order.save();

    // Determine the notification type based on the status
    let notificationType = "Status Change";
    let notificationMessage = `Your order #${order._id} status has been changed to ${status}.`;

    switch (status) {
      case "Approved":
        notificationMessage = `Your request to borrow book #${order.book_id.identifier_code} has been approved. The due date is ${order.dueDate}.`;
        break;
      case "Rejected":
        notificationMessage = `Your order #${order._id} has been rejected. Reason: ${reason_order}.`;
        break;
      case "Received":
        notificationMessage = `You have received book #${order.book_id.identifier_code}.`;
        break;
      case "Returned":
        notificationMessage = `You have successfully returned book #${order.book_id.identifier_code}.`;
        break;
      case "Overdue":
        notificationMessage = `Your book #${order.book_id.identifier_code} is overdue. Please return it as soon as possible.`;
        break;
      case "Lost":
        notificationMessage = `Book #${order.book_id.identifier_code} has been reported lost. Reason: ${reason_order}.`;
        break;
      case "Renew Pending":
        notificationMessage = `Your request to renew book #${order.book_id.identifier_code} is being processed.`;
        break;
      case "Canceled":
        notificationMessage = `Your order #${order._id} has been canceled.`;
        break;
    }

    // Create a notification for the user who created the order
    const notification = new Notification({
      userId: order.created_by._id,
      type: status,
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

// Approve multiple orders
const bulkUpdateOrderStatus = async (req, res) => {
  try {
    const { orderIds, updated_by } = req.body;

    // Validate input
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return res.status(400).json({ message: "No orders selected." });
    }

    // Find and update the orders in bulk where the status is "Pending"
    const orders = await Order.find({
      _id: { $in: orderIds }, // Match the selected IDs
      status: { $in: ["Pending", "Renew Pending"] }
    });

    if (orders.length === 0) {
      return res.status(404).json({ message: "No pending orders found." });
    }

    // Update each order's status to "Approved"
    const bulkOperations = orders.map((order) => {
      if (order.status === "Pending") {
        order.status = "Approved";
      } else if (order.status === "Renew Pending") {
        order.status = "Received";
      }
      order.updated_by = updated_by;
      return order.save();
    });

    // Execute all bulk updates
    await Promise.all(bulkOperations);

    return res.status(200).json({
      message: "Selected orders approved successfully.",
      data: orders,
    });
  } catch (error) {
    console.error("Error in bulk updating order status:", error);
    return res.status(500).json({
      message: "An error occurred",
      error: error.message,
    });
  }
};


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
    const borrowDateObj = new Date(order.borrowDate);
    const dueDateObj = new Date(dueDate);

    const differenceInDays =
        (dueDateObj - borrowDateObj) / (1000 * 60 * 60 * 24);
    var availableDays = 14;
    switch (order.renewalCount) {
      case 1: availableDays = 14*2; break;
      case 2: availableDays = 14*3; break;
      default: availableDays = 14; break;
    }
    if (differenceInDays > availableDays) {
      return res.status(400).json({
        message: "The maximum term for borrowing books is 14 days",
        data: null,
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
    order.renew_reason = renew_reason;

    await order.save();

    const notification = new Notification({
      userId: userId,
      type: "Renew Pending",
      message: `Your request to renew book #${order.book_id.identifier_code} is being processed. The new book return date is ${dueDate}.`,
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
    const { userId, book_condition } = req.body;

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
    const book = await Book.findById(order.book_id);
    if(order.status === 'Lost' || book_condition === 'Lost' || book_condition === 'Hard') {
      book.status = "Destroyed";
      book.condition = book_condition;
      await book.save();
    } else {
      book.status = "Available";
      book.condition = book_condition;
      await book.save();
      const bookSet = await BookSet.findById(book.bookSet_id);
      console.log(book);
      bookSet.availableCopies += 1;
      await bookSet.save();
    }

    order.status = "Returned";
    order.returnDate = new Date();

    await order.save();

    const notification = new Notification({
      userId: userId,
      type: "Returned",
      message: `You have successfully returned the book #${order.book_id.identifier_code} on ${order.returnDate} . Book condition is: ${order.book_id.condition}. Thank you!`,
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
      .populate({
        path: "book_id",
        select: "identifier_code",
        populate: {
          path: "bookSet_id",
          select: "title",
        },
      })
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
      message: `Book ${order.book_id.identifier_code} has been reported lost.`,
    });
    await notification.save();

    return res.status(200).json({
      message: `Report lost books successfully.`,
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
      message: `You have been penalized ${penaltyReason.penaltyAmount}k for book ${order.book_id.identifier_code} for loss.`,
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

//Reject overdue orders which are not picked up by users
const rejectOverdueOrders = async (req, res, next) => {
  try {
    // const { orderId } = req.params;

    const now = new Date();
    const pendingOrders = await Order.find({
      // _id: orderId, // testing
      status: "Approved",
    });
    // Loop through all pending orders to check if any of them are overdue
    for (const order of pendingOrders) {
      const requestDate = new Date(order.requestDate);
      const daysDiff = Math.floor((now - requestDate) / (1000 * 60 * 60 * 24));

      // If the order is overdue by more than 3 days, reject the order
      if (daysDiff > 3) {
        order.status = "Canceled";
        order.reason_order = "User did not pick up the book within 3 days.";
        await order.save();

        // Send a notification to the user
        const notification = new Notification({
          userId: order.created_by,
          type: "Rejected",
          message: `Your order #${order._id} has been rejected because you did not pick up the book within 3 days.`,
        });
        await notification.save();
      }
    }
    res.status(200).json({
      message: "Overdue orders rejected successfully.",
      data: pendingOrders,
    });
    console.log("Checking and rejecting overdue orders...");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error in rejecting overdue orders:", error);
  }
};

// Check due dates and send notifications to users
const checkDueDatesAndReminder = async (req, res, next) => {
  try {
    // const { orderId } = req.params;
    const now = new Date();
    const orders = await Order.find({
      // _id: orderId, // testing
      status: { $in: ["Approved", "Received"] },
    });

    // Loop through all orders to check due dates and send notifications
    for (const order of orders) {
      const dueDate = new Date(order.dueDate);
      const daysUntilDue = Math.floor((dueDate - now) / (1000 * 60 * 60 * 24)); // number of days until due date

      // If the book is due in 3 days, send a reminder notification
      if (daysUntilDue <= 3) {
        const reminderNotification = new Notification({
          userId: order.created_by,
          orderId: order._id,
          type: "Reminder",
          message: `Your book is due in ${daysUntilDue} days! Please return it by ${dueDate.toDateString()}.`,
        });
        await reminderNotification.save();
        console.log(
          `Sent reminder to user ${order.created_by} for order ${order._id}`
        );
      }
    }
    res.status(200).json({
      message: "Due dates checked and notifications sent.",
      data: orders,
    });
    console.log("Checking due dates and sending reminders...");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error checking due dates and sending notifications:", error);
  }
};

// Check overdue orders and apply fines
const checkOverdueAndApplyFines = async (req, res, next) => {
  try {
    // const { orderId } = req.params;
    const now = new Date();
    const orders = await Order.find({
      // _id: orderId, // testing
      status: { $in: ["Pending", "Approved", "Received"] },
    });

    for (const order of orders) {
      const dueDate = new Date(order.dueDate);
      const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24)); // number of days overdue

      if (daysOverdue > 0) {
        let penaltyReason;

        // Chọn lý do phạt dựa trên số ngày quá hạn
        if (daysOverdue <= 3) {
          penaltyReason = await PenaltyReason.findOne({
            reasonName: "Overdue 1-3 days",
          });
        } else if (daysOverdue <= 7) {
          penaltyReason = await PenaltyReason.findOne({
            reasonName: "Overdue 4-7 days",
          });
        } else {
          penaltyReason = await PenaltyReason.findOne({
            reasonName: "Overdue over 7 days",
          });
        }

        if (penaltyReason) {
          const fine = new Fines({
            user_id: order.created_by,
            book_id: order.book_id,
            order_id: order._id,
            fineReason_id: penaltyReason._id,
            totalFineAmount: penaltyReason.penaltyAmount,
            status: "Pending",
            createdAt: now,
            updatedAt: now,
          });
          await fine.save();

          // Send a notification to the user
          const fineNotification = new Notification({
            userId: order.created_by,
            orderId: order._id,
            type: "Fines",
            message: `Your book is overdue by ${daysOverdue} days. You have been fined ${penaltyReason.penaltyAmount}VND.`,
          });

          await fineNotification.save();
          console.log(
            `Applied fine for order ${order._id} with amount ${penaltyReason.penaltyAmount}`
          );
        }

        // Cập nhật trạng thái đơn hàng thành "Overdue" nếu chưa được cập nhật
        if (order.status !== "Overdue") {
          order.status = "Overdue";
          await order.save();
        }
      }
    }
    res.status(200).json({
      message: "Overdue orders checked and fines applied.",
      data: orders,
    });
    console.log("Checking overdue orders and applying fines...");
  } catch (error) {
    res.status(404).json({ message: error.message });
    console.error("Error checking due dates and applying fines:", error);
  }
};

// Schedule a cron job to run every day at midnight to check overdue orders
cron.schedule("0 0 * * *", () => {
  console.log("Running cron job to check overdue orders...");
  rejectOverdueOrders();

  console.log("Running cron job to check due dates and send notifications...");
  checkDueDatesAndReminder();

  console.log("Running cron job to check overdue orders and apply fines...");
  checkOverdueAndApplyFines();
});

const OrderController = {
  getOrderByUserId,
  getAllOrder,
  getOrderById,
  createBorrowOrder,
  changeOrderStatus,
  bulkUpdateOrderStatus,
  renewOrder,
  returnOrder,
  filterOrdersByStatus,
  reportLostBook,
  applyFinesForLostBook,
  getOrderByIdentifierCode,
  // rejectOverdueOrders,
  // checkDueDatesAndReminder,
  // checkOverdueAndApplyFines,
};
module.exports = OrderController;
