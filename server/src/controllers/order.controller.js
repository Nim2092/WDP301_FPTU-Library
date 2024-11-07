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
const nodemailer = require("nodemailer");

//for send email
let transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "titi2024hd@gmail.com",
    pass: "mrwm vfbp dprc qwyu",
  },
});

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
        message: "Lấy tất cả đơn hàng thất bại",
        data: null,
      });
    }

    res.status(200).json({
      message: "Lấy tất cả đơn hàng thành công",
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
      message: "Lấy đơn hàng thành công",
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

    // Tìm tất cả sách có identifier_code chứa đoạn chuỗi identifierCode
    const books = await Book.find({ identifier_code: { $regex: identifierCode, $options: "i" } });

    if (!books.length) {
      return res.status(404).json({ message: "Không tìm thấy sách với mã identifier_code yêu cầu" });
    }

    // Lấy danh sách _id của các sách tìm được
    const bookIds = books.map(book => book._id);

    // Tìm tất cả các đơn hàng có book_id thuộc danh sách bookIds
    const orders = await Order.find({ book_id: { $in: bookIds } })
        .populate({
          path: "book_id", // Populate the book reference
          populate: {
            path: "bookSet_id", // Nested populate to get book set details
            model: "BookSet", // Reference to the BookSet model
          },
        })
        .populate("created_by", "fullName") // Populate the creator's full name
        .populate("updated_by", "fullName"); // Populate the updater's full name

    // Kiểm tra xem có đơn hàng nào tìm thấy không
    if (!orders.length) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng nào" });
    }

    // Trả về danh sách đơn hàng đã tìm thấy
    res.status(200).json({
      message: "Get orders successfully",
      data: orders,
    });
  } catch (error) {
    console.error("Error getting the orders", error);
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
    if (book.status !== "Available") {
      return res.status(500).json({
        message: "Sách đã được mượn hoặc không đủ điều kiện để mượn.",
        data: null,
      });
    }

    //check if book set exists and has available copies
    const bookSet = await BookSet.findById(book.bookSet_id);
    if (!bookSet || bookSet.availableCopies < 1) {
      return res.status(400).json({
        message: "Không còn quyển sách nào có sẵn cho bộ sách này",
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
        message:
          "Sách này đã được mượn hoặc đã được đặt trước bởi người dùng khác",
        data: null,
      });
    }

    // Check if borrow date and due date are valid
    if (!borrowDate || !dueDate) {
      return res.status(400).json({
        message: "Ngày mượn và ngày trả sách là bắt buộc",
        data: null,
      });
    }

    const borrowDateObj = new Date(borrowDate);
    const dueDateObj = new Date(dueDate);

    const differenceInDays =
      (dueDateObj - borrowDateObj) / (1000 * 60 * 60 * 24);

    if (differenceInDays > 14) {
      return res.status(400).json({
        message: "Thời hạn mượn sách tối đa là 14 ngày",
        data: null,
      });
    }

    if (isNaN(borrowDateObj.getTime()) || isNaN(dueDateObj.getTime())) {
      return res.status(400).json({
        message: "Ngày mượn hoặc ngày trả sách không hợp lệ",
        data: null,
      });
    }

    if (dueDateObj <= borrowDateObj) {
      return res.status(400).json({
        message: "Ngày trả sách phải sau ngày mượn sách",
        data: null,
      });
    }

    // Check if due date is more than 14 days after borrow date
    const maxDueDate = new Date(borrowDateObj);
    maxDueDate.setDate(maxDueDate.getDate() + 14); // Add 14 days

    if (dueDateObj > maxDueDate) {
      return res.status(400).json({
        message: "Ngày trả sách không được quá 14 ngày sau ngày mượn sách",
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

    // Create a notification for the user who created the order
    const notification = new Notification({
      userId: userId,
      type: "Pending",
      message: `Bạn đã yêu cầu mượn sách ${bookSet.title} thành công. Ngày trả sách của bạn là ${dueDateObj.toDateString()}.`,
    });

    await notification.save();

    // send email
    const userEmail = user.email;
    let info = await transporter.sendMail({
      from: '"Thông Báo Thư Viện" <titi2024hd@gmail.com>',
      to: userEmail,
      subject: "Xác Nhận Yêu Cầu Mượn Sách",
      text: `Xin chào, bạn đã yêu cầu mượn sách với mã định danh #${
        book.identifier_code
      } thành công. Ngày trả sách của bạn là ${dueDateObj.toDateString()}. Cảm ơn bạn đã sử dụng dịch vụ của thư viện.`,
      html: `<b>Xin chào</b>, bạn đã yêu cầu mượn sách với mã định danh <strong>#${
        book.identifier_code
      }</strong> thành công.<br>Ngày trả sách của bạn là <strong>${dueDateObj.toDateString()}</strong>.<br><br>Cảm ơn bạn đã sử dụng dịch vụ của thư viện.`,
    });

    console.log(
      `Đã gửi email xác nhận yêu cầu mượn sách tới ${userEmail} cho đơn hàng ${newOrder._id}`
    );

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

    const book = await Book.findById(order.book_id);
    const bookSet = await BookSet.findById(book.bookSet_id);
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
      return res
        .status(400)
        .json({ message: "Trạng thái cập nhật không hợp lệ." });
    }
    if (status === 'Received') {
      order.borrowDate = new Date();
    }

    // Xử lý từ chối với lý do
    if (status === "Rejected") {
      if (!reason_order || reason_order.trim() === "") {
        return res.status(400).json({ message: "Lý do từ chối là bắt buộc." });
      }
      order.reason_order = reason_order;
    }

    // Check if the order is overdue or lost and the status is being changed to Renew Pending
    if (
      status === "Renew Pending" &&
      (order.status === "Lost" || order.status === "Overdue")
    ) {
      return res
        .status(400)
        .json({ message: "Không thể gia hạn sách bị mất hoặc quá hạn" });
    }

    //Check can not renew a returned order
    if (order.status === "Returned" && status === "Renew Pending") {
      return res.status(400).json({
        message: "Không thể gia hạn đơn hàng đã trả",
      });
    }

    //Check just orders with status Pending or Renew Pending can be cancel
    const cancelableStatuses = ["Pending", "Renew Pending"];
    if (status === "Canceled" && !cancelableStatuses.includes(order.status)) {
      return res.status(400).json({
        message: `Chỉ có thể hủy đơn hàng với trạng thái ${cancelableStatuses.join(
          " hoặc "
        )}.`,
      });
    }

    //Order cancellation limits
    if (status === "Canceled") {
      const user = order.created_by;
      const startOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        1
      );
      const endOfMonth = new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        0
      );

      // Find all canceled orders by the user in the current month
      const cancellationsThisMonth = await Order.countDocuments({
        created_by: user._id,
        status: "Canceled",
        updatedAt: { $gte: startOfMonth, $lte: endOfMonth },
      });


      if (cancellationsThisMonth >= 3) {
        return res.status(400).json({
          message:
            "Bạn đã đạt đến giới hạn số lần hủy đơn hàng trong tháng này.",
        });
      }
      book.status = 'Available';
      await book.save();
      bookSet.availableCopies += 1;
      await bookSet.save();
    }

    // Update the order status
    order.status = status;
    order.updated_by = updated_by;

    // Save the updated order
    await order.save();

    // Determine the notification type based on the status
    let notificationType = "Status Change";
    let notificationMessage = `Trạng thái đơn hàng #${order._id} của bạn đã được cập nhật thành ${status}.`;

    switch (status) {
      case "Approved":
        notificationMessage = `Yêu cầu mượn sách ${bookSet.title} với mã định danh #${order.book_id.identifier_code} của bạn đã được chấp thuận. Ngày trả sách là ${order.dueDate}.`;
        break;
      case "Rejected":
        notificationMessage = `Đơn hàng của bạn #${order._id} đã bị từ chối. Lý do: ${reason_order}.`;
        break;
      case "Received":
        notificationMessage = `Bạn đã nhận sách ${bookSet.title} với mã định danh #${order.book_id.identifier_code}.`;
        break;
      case "Returned":
        notificationMessage = `Bạn đã trả sách ${bookSet.title} với mã định danh #${order.book_id.identifier_code} thành công.`;
        break;
      case "Overdue":
        notificationMessage = `Sách ${bookSet.title} với mã định danh #${order.book_id.identifier_code} của bạn đã quá hạn. Vui lòng trả sách sớm nhất có thể.`;
        break;
      case "Lost":
        notificationMessage = `Sách ${bookSet.title} với mã định danh #${order.book_id.identifier_code} đã được báo mất. Lý do: ${reason_order}.`;
        break;
      case "Renew Pending":
        notificationMessage = `Yêu cầu gia hạn sách ${bookSet.title} với mã định danh #${order.book_id.identifier_code} của bạn đang được xử lý.`;
        break;
      case "Canceled":
        notificationMessage = `Đơn hàng của bạn #${order._id} đã bị hủy.`;
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
      status: { $in: ["Pending", "Renew Pending"] },
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
        message: "Vui lòng cung cấp ngày trả sách mới.",
      });
    }
    if (!renew_reason) {
      return res.status(400).json({
        message: "Vui lòng cung cấp lý do gia hạn.",
      });
    }

    // Find the order by ID and check if it is in 'Received' status
    const order = await Order.findById(orderId).populate(
      "book_id",
      "identifier_code condition"
    );
    if (!order) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng.",
      });
    }

    if (order.status !== "Received") {
      return res.status(400).json({
        message: "Chỉ có thể gia hạn đơn hàng với trạng thái 'Đã nhận'.",
      });
    }

    const oldDueDateObj = new Date(order.dueDate);
    const dueDateObj = new Date(dueDate);

    const differenceInDays =
      (dueDateObj - oldDueDateObj) / (1000 * 60 * 60 * 24);
    if (differenceInDays > 14) {
      return res.status(400).json({
        message: "Thời hạn gia hạn sách tối đa là 14 ngày",
        data: null,
      });
    }

    if (order.renewalCount >= 3) {
      return res.status(400).json({
        message: "Đơn hàng không thể gia hạn quá 3 lần.",
      });
    }

    // Update order details for renewal
    order.dueDate = dueDate;
    order.renewalCount += 1;
    order.renewalDate = new Date();
    order.renew_reason = renew_reason;
    order.status = "Renew Pending"; // Set status to Renew Pending

    await order.save();

    const notification = new Notification({
      userId: userId,
      type: "Renew Pending",
      message: `Yêu cầu gia hạn sách ${bookSet.title} với mã định danh #${order.book_id.identifier_code} của bạn đang được xử lý. Ngày trả sách mới là ${dueDate}.`,
    });

    await notification.save();

    // Tìm thông tin người dùng để gửi email
    const user = await User.findById(userId).populate("email");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Gửi email thông báo cho người dùng
    const userEmail = user.email;
    let info = await transporter.sendMail({
      from: '"Thông Báo Thư Viện" <titi2024hd@gmail.com>',
      to: userEmail,
      subject: "Yêu Cầu Gia Hạn Sách Đã Được Tiếp Nhận",
      text: `Xin chào, yêu cầu gia hạn sách với mã định danh ${order.book_id.identifier_code} của bạn đang được xử lý. Ngày trả sách mới là ${dueDate}. Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.`,
      html: `<b>Xin chào</b>, yêu cầu gia hạn sách với mã định danh <strong>${order.book_id.identifier_code}</strong> của bạn đang được xử lý. <br>Ngày trả sách mới là <strong>${dueDate}</strong>.<br><br>Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi.`,
    });

    console.log(
      `Sent renewal confirmation email to ${userEmail} for order ${orderId}`
    );

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
    const {
      userId,
      book_condition,
      returnDate,
      createBy,
      updateBy,
      fine_reason,
      condition_detail,
    } = req.body;

    const order = await Order.findById(orderId)
      .populate("book_id", "identifier_code condition")
      .populate({
        path: "book_id",
        select: "identifier_code",
        populate: {
          path: "bookSet_id",
          select: "title",
        },
      });
    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    if (order.returnDate) {
      return res.status(400).json({
        message: "Sách đã được trả trước đó.",
      });
    }
    const book = await Book.findById(order.book_id);
    const bookSet = await BookSet.findById(book.bookSet_id);
    var isDestroyed = false;
    var fineReasonType = "";
    switch (book_condition) {
      default:
        isDestroyed = false;
        fineReasonType = "";
        break;
      case "Light":
        isDestroyed = false;
        fineReasonType = "PN2";
        break;
      case "Medium":
        isDestroyed = false;
        fineReasonType = "PN3";
        break;
      case "Hard":
        isDestroyed = true;
        fineReasonType = "PN4";
        break;
      case "Lost":
        isDestroyed = true;
        fineReasonType = "PN5";
        break;
    }

    let finesApplied = [];

    if (fineReasonType) {
      const fineReason = await PenaltyReason.findOne({ type: fineReasonType });
      const fineReason_id = fineReason._id;
      const bookSet = await BookSet.findById(book.bookSet_id);
      const totalAmount = (fineReason.penaltyAmount * bookSet.price) / 100;
      const fines = new Fines({
        user_id: userId,
        book_id: order.book_id,
        order_id: orderId,
        fineReason_id,
        createBy,
        updateBy,
        totalFinesAmount: totalAmount,
        status: "Pending",
        paymentMethod: null,
        paymentDate: null,
        reason: fine_reason,
      });

      await fines.save();

      finesApplied.push({
        type: "Condition Fine",
        amount: totalAmount,
        message: `Áp dụng phạt cho tình trạng sách: ${book_condition}`,
      });
    }
    const returnDateObj = new Date(returnDate);
    const dueDateObj = new Date(order.dueDate);
    const daysLate = Math.floor(
      (returnDateObj - dueDateObj) / (1000 * 60 * 60 * 24)
    );
    if (daysLate > 0) {
      const overdueFine = await PenaltyReason.findOne({ type: "PN1" });
      const overdueFineId = overdueFine._id;
      const fineAmount = daysLate * overdueFine.penaltyAmount;
      const fines = new Fines({
        user_id: userId,
        book_id: order.book_id,
        order_id: orderId,
        fineReason_id: overdueFineId,
        createBy,
        updateBy,
        totalFinesAmount: fineAmount,
        status: "Pending",
        paymentMethod: null,
        paymentDate: null,
        reason: "Overdue",
      });

      await fines.save();
      finesApplied.push({
        type: "Overdue Fine",
        amount: fineAmount,
        message: `Áp dụng phạt cho việc trả sách quá hạn ${daysLate} ngày`,
      });
    }
    if (order.status === "Lost" || isDestroyed) {
      book.status = "Destroyed";
      book.condition = book_condition;
      if (condition_detail) book.condition_detail = condition_detail;
      await book.save();
    } else {
      book.status = "Available";
      book.condition = book_condition;
      if (condition_detail) book.condition_detail = condition_detail;
      await book.save();
      const bookSet = await BookSet.findById(book.bookSet_id);
      console.log(book);
      bookSet.availableCopies += 1;
      await bookSet.save();
    }

    order.status = "Returned";
    order.returnDate = new Date(returnDate);
    if (condition_detail) order.book_condition_detail = condition_detail;

    await order.save();

    const notification = new Notification({
      userId: userId,
      type: "Returned",
      message: `Bạn đã trả sách ${bookSet.title} thành công với mã định danh #${order.book_id.identifier_code} vào ngày ${order.returnDate}. Tình trạng sách: ${order.book_id.condition}. Cảm ơn bạn!`,
    });

    await notification.save();

    // Tìm thông tin người dùng để gửi email
    const user = await User.findById(userId).populate("email");
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // send email
    const userEmail = user.email;
    const fineDetails = finesApplied
      .map((fine) => `${fine.message} với số tiền: ${fine.amount} VND`)
      .join("<br>");
    const formatCurrency = (amount) => {
      return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
      }).format(amount);
    };

    const fineDetailsFormatted = finesApplied
      .map(
        (fine) => `${fine.message} với số tiền: ${formatCurrency(fine.amount)}`
      )
      .join("<br>");

    // Gửi email với fineDetails đã định dạng
    let info = await transporter.sendMail({
      from: '"Thông Báo Thư Viện" <titi2024hd@gmail.com>',
      to: userEmail,
      subject: "Xác Nhận Trả Sách",
      text: `Xin chào, bạn đã trả sách ${bookSet.title} thành công với mã định danh #${order.book_id.identifier_code} vào ngày ${order.returnDate}. Tình trạng sách: ${condition_detail}. ${fineDetailsFormatted}`,
      html: `<b>Xin chào</b>, bạn đã trả sách thành công với mã định danh <strong>#${order.book_id.identifier_code}</strong> vào ngày ${order.returnDate}.<br>Tình trạng sách: <strong>${condition_detail}</strong>.<br>${fineDetailsFormatted}<br><br>Cảm ơn bạn!`,
    });

    console.log(
      `Sent return confirmation email to ${userEmail} for order ${orderId}`
    );

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
        message:
          "Trạng thái không hợp lệ. Vui lòng cung cấp trạng thái đơn hàng hợp lệ.",
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
        message: "Không tìm thấy đơn hàng với trạng thái được cung cấp.",
        data: null,
      });
    }

    return res.status(200).json({
      message: `Đã lấy thành công các đơn hàng với trạng thái '${status}'.`,
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

// Report lost book
const reportLostBook = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const { userId, createBy, updateBy } = req.body;

    // Find the order and populate the necessary fields
    const order = await Order.findById(orderId).populate(
      "book_id",
      "identifier_code condition"
    );

    if (!order) {
      return res.status(404).json({ message: "Order not found." });
    }
    const book = await Book.findById(order.book_id);
    book.condition = "Lost";
    book.status = "Destroyed";
    await book.save();
    const fineReason = await PenaltyReason.findOne({ type: "PN5" });
    const fineReason_id = fineReason._id;
    const bookSet = await BookSet.findById(book.bookSet_id);
    const totalAmount = (fineReason.penaltyAmount * bookSet.price) / 100;
    const fines = new Fines({
      user_id: userId,
      book_id: order.book_id._id,
      order_id: orderId,
      fineReason_id,
      createBy,
      updateBy,
      totalFinesAmount: totalAmount,
      status: "Pending",
      paymentMethod: null,
      paymentDate: null,
      reason: "Lost book",
    });
    await fines.save();

    // Check if the order status is "Received" before allowing it to be reported as "Lost"
    if (order.status !== "Received") {
      return res.status(400).json({
        message:
          "Chỉ có thể báo mất sách cho các đơn hàng có trạng thái 'Đã nhận'.",
      });
    }

    // Update the order status to "Lost"
    order.status = "Lost";
    await order.save();

    // Create a notification to inform the user
    const notification = new Notification({
      userId: userId,
      type: "Lost",
      message: `Sách ${bookSet.title} với mã định danh ${order.book_id.identifier_code} đã được báo mất.`,
    });
    await notification.save();

    return res.status(200).json({
      message: "Report lost book successfully.",
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

    const order = await Order.findById(orderId).populate({
      path: "book_id",
      select: "identifier_code",
      populate: {
        path: "bookSet_id",
        select: "title",
      },
    });
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
      book_id: order.book_id,
      order_id: orderId,
      fineReason_id: fineReasonId,
      createBy: createBy,
      updateBy: updateBy,
      totalFinesAmount: penaltyReason.penaltyAmount,
      status: "Pending",
      createdAt: new Date(),
      updatedAt: new Date(),
      paymentMethod: null,
      paymentDate: null,
      reason: "Lost book",
    });

    await fines.save();

    // Create notification for the user
    const notification = new Notification({
      userId: userId,
      type: "Fines",
      message: `Bạn đã bị phạt ${penaltyReason.penaltyAmount} VND vì làm mất sách "${order.book_id.bookSet_id.title}".`,
    });
    await notification.save();

    // Tìm thông tin người dùng để gửi email
    const user = await User.findById(userId).populate("email");
    if (!user) {
      return res.status(404).json({ message: "Không tìm thấy người dùng." });
    }

    // Gửi email thông báo cho người dùng
    const userEmail = user.email;
    let info = await transporter.sendMail({
      from: '"Thông Báo Thư Viện" <titi2024hd@gmail.com>',
      to: userEmail,
      subject: "Thông Báo Phạt Mất Sách",
      text: `Xin chào, bạn đã bị phạt ${penaltyReason.penaltyAmount} VND vì làm mất sách "${order.book_id.bookSet_id.title}". Vui lòng liên hệ với thư viện để được hỗ trợ thêm nếu cần.`,
      html: `<b>Xin chào</b>, bạn đã bị phạt <strong>${penaltyReason.penaltyAmount}</strong> VND vì làm mất sách <strong>"${order.book_id.bookSet_id.title}"</strong>. <br><br>Vui lòng liên hệ với thư viện để được hỗ trợ thêm nếu cần.`,
    });

    console.log(
      `Sent lost book fine email to ${userEmail} for order ${orderId}`
    );

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

//Cancel overdue orders which are not picked up by users
const cancelOverdueOrders = async (req, res, next) => {
  try {
    // const { orderId } = req.params;

    const now = new Date();
    const pendingOrders = await Order.find({
      status: "Approved",
    })
      .populate("created_by", "name email")
      .populate({
        path: "book_id",
        select: "identifier_code",
        populate: {
          path: "bookSet_id",
          select: "title",
        },
      });
    let emailSent = [];
    // Loop through all pending orders to check if any of them are overdue
    for (const order of pendingOrders) {
      const requestDate = new Date(order.borrowDate);
      const daysDiff = Math.floor((now - requestDate) / (1000 * 60 * 60 * 24));
      // If the order is overdue by more than 3 days, reject the order
      if (daysDiff > 3) {
        order.status = "Canceled";
        order.reason_order =
          "Người dùng không đến nhận sách trong vòng 3 ngày.";
        await order.save();
        const book = await Book.findById(order.book_id);
        book.status = "Available";
        await book.save();
        const bookSet = await BookSet.findById(book.bookSet_id);
        bookSet.availableCopies += 1;
        await bookSet.save();

        // Send a notification to the user
        const notification = new Notification({
          userId: order.created_by,
          type: "Canceled",
          message: `Đơn hàng #${order._id} của bạn đã bị hủy vì bạn không đến nhận sách trong vòng 3 ngày.`,
        });
        await notification.save();

        // Send an email to the user
        const userEmail = order.created_by.email;
        let info = await transporter.sendMail({
          from: '"Thông Báo Thư Viện" <titi2024hd@gmail.com>',
          to: userEmail,
          subject: "Đơn Hàng Bị Hủy - Không Nhận Sách",
          text: `Xin chào, đơn hàng của bạn cho cuốn sách "${order.book_id.bookSet_id.title}" (Mã Đơn Hàng: ${order._id}) đã bị hủy vì bạn không đến nhận sách trong vòng 3 ngày. Vui lòng liên hệ với thư viện để được hỗ trợ thêm nếu cần.`,
          html: `<b>Xin chào</b>, đơn hàng của bạn cho cuốn sách "<strong>${order.book_id.bookSet_id.title}</strong>" (Mã Đơn Hàng: ${order._id}) đã bị hủy vì bạn không đến nhận sách trong vòng 3 ngày. <br><br>Vui lòng liên hệ với thư viện để được hỗ trợ thêm nếu cần.`,
        });

        // Lưu lại các thông tin về thông báo đã gửi
        emailSent.push({
          userEmail,
          orderId: order._id,
          message: `Sent cancellation email for "${order.book_id.bookSet_id.title}" due to overdue.`,
        });

        console.log(
          `Sent cancellation email to ${userEmail} for order ${order._id}`
        );
      }
    }
    res.status(200).json({
      message: "Overdue orders Canceled successfully and email sent.",
      data: emailSent,
    });
    console.log("Checking and Canceled overdue orders...");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error in rejecting overdue orders:", error);
  }
};

// Reminder due dates orders for users
const reminderDueDatesOrder = async (req, res, next) => {
  try {
    // const { orderId } = req.params; //testing
    const now = new Date();
    const orders = await Order.find({
      // _id: orderId, // testing
      status: { $in: ["Received"] },
    })
      .populate({
        path: "book_id",
        select: "identifier_code",
        populate: {
          path: "bookSet_id",
          select: "title",
        },
      })
      .populate("created_by", "name email");
    console.log(orders);
    let emailSent = [];
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
          message: `Sách của bạn sẽ đến hạn trong ${daysUntilDue} ngày! Vui lòng trả sách trước ngày ${dueDate.toDateString()}.`,
        });
        await reminderNotification.save();
        console.log(
          `Đã gửi nhắc nhở đến người dùng ${order.created_by} cho đơn hàng ${order._id}`
        );

        //send email
        const userEmail = order.created_by.email;
        let info = await transporter.sendMail({
          from: '"Thư Viện Nhắc Nhở" <titi2024hd@gmail.com>',
          to: userEmail,
          subject: "Nhắc Nhở Trả Sách",
          text: `Xin chào, đây là lời nhắc rằng sách "${
            order.book_id.bookSet_id.title
          }" của bạn sẽ đến hạn trong ${daysUntilDue} ngày vào ngày ${dueDate.toDateString()}. Vui lòng trả sách đúng hạn để tránh bị phạt.`,
          html: `<b>Xin chào</b>, đây là lời nhắc rằng sách "${
            order.book_id.bookSet_id.title
          }" của bạn sẽ đến hạn trong <strong>${daysUntilDue}</strong> ngày vào ngày <strong>${dueDate.toDateString()}</strong>. <br><br>Vui lòng trả sách đúng hạn để tránh bị phạt.`,
        });

        emailSent.push({
          userEmail,
          orderId: order._id,
          message: `Sent reminder for "${order.book_id.bookSet_id.title}" due in ${daysUntilDue} days.`,
        });

        console.log(`Sent reminder to user ${userEmail}`);
      }
    }
    res.status(200).json({
      message: "Due dates checked and notifications sent.",
      data: emailSent,
    });
    console.log("Checking due dates and sending reminders...");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error checking due dates and sending notifications:", error);
  }
};

// Reminder overdue orders for users
const reminderOverdueOrder = async (req, res, next) => {
  try {
    const now = new Date();
    const orders = await Order.find({
      status: { $in: ["Received"] },
    })
      .populate("created_by", "name email")
      .populate({
        path: "book_id",
        select: "identifier_code",
        populate: {
          path: "bookSet_id",
          select: "title",
        },
      });

    let emailSent = [];

    for (const order of orders) {
      const dueDate = new Date(order.dueDate);
      const daysOverdue = Math.floor((now - dueDate) / (1000 * 60 * 60 * 24));

      if (daysOverdue > 0) {
        const penaltyReason = await PenaltyReason.findOne({
          reasonName: "Overdue",
        });

        if (penaltyReason) {
          // Create a notification for the user
          const overdueNotification = new Notification({
            userId: order.created_by._id,
            orderId: order._id,
            type: "Reminder",
            message: `Sách của bạn đã quá hạn ${daysOverdue} ngày. Vui lòng trả sách để tránh bị phạt thêm.`,
          });
          await overdueNotification.save();

          // Send an email to the user
          const userEmail = order.created_by.email;
          let info = await transporter.sendMail({
            from: '"Thông Báo Thư Viện" <titi2024hd@gmail.com>',
            to: userEmail,
            subject: "Thông Báo Phạt Quá Hạn",
            text: `Xin chào, sách "${order.book_id.bookSet_id.title}" của bạn đã quá hạn ${daysOverdue} ngày. Vui lòng trả sách và thanh toán tiền phạt để tránh bị phạt thêm.`,
            html: `<b>Xin chào</b>, sách "<strong>${order.book_id.bookSet_id.title}</strong>" của bạn đã quá hạn <strong>${daysOverdue}</strong> ngày. <br><br>Vui lòng trả sách và thanh toán tiền phạt để tránh bị phạt thêm.`,
          });

          // Lưu lại các thông tin về phạt đã áp dụng
          emailSent.push({
            userEmail,
            orderId: order._id,
            message: `Sent email for "${order.book_id.bookSet_id.title}" overdue by ${daysOverdue} days.`,
          });

          console.log(`Sent fine email to ${userEmail} for order ${order._id}`);
        }

        // Cập nhật trạng thái đơn hàng thành "Overdue" nếu chưa được cập nhật
        if (order.status !== "Overdue") {
          order.status = "Overdue";
          await order.save();
        }
      }
    }

    res.status(200).json({
      message: "Reminder for overdue orders sent successfully.",
      data: emailSent,
    });
    console.log("Reminder for overdue orders...");
  } catch (error) {
    res.status(500).json({ message: error.message });
    console.error("Error reminder for overdue orders", error);
  }
};

const ChartOrderbyMonth = async (req, res, next) => {
  try {
    // Get the current year or use the year from a query parameter if provided
    const year = req.query.year || new Date().getFullYear();

    const monthlyStats = await Order.aggregate([
      {
        $match: {
          requestDate: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
          },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: "$requestDate" },
            status: "$status",
          },
          count: { $sum: 1 },
        },
      },
      {
        $group: {
          _id: "$_id.month",
          statuses: {
            $push: { status: "$_id.status", count: "$count" },
          },
        },
      },
      {
        $sort: { _id: 1 },
      },
      {
        $project: {
          month: "$_id",
          statuses: 1,
        },
      },
    ]);

    res.status(200).json({
      message: "Monthly order stats retrieved successfully",
      data: monthlyStats,
    });
  } catch (error) {
    console.error("Error in ChartOrderbyMonth:", error); // Log for debugging
    res.status(500).json({
      message: "Error retrieving monthly stats",
      error: error.message,
    });
  }
};

// Schedule a cron job to run every day at midnight to check overdue orders
// cron.schedule("0 0 * * *", () => {
//   console.log("Running cron job to check overdue orders...");
//   cancelOverdueOrders();

//   console.log("Running cron job to check due dates and send notifications...");
//   reminderDueDatesOrder();

//   console.log("Running cron job to check overdue orders and apply fines...");
//   reminderOverdueOrder();
// });

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
  cancelOverdueOrders,
  reminderDueDatesOrder,
  reminderOverdueOrder,
  ChartOrderbyMonth,
};
module.exports = OrderController;
