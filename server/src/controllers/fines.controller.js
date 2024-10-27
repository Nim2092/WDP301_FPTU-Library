const { default: mongoose } = require("mongoose");
const axios = require('axios');
const db = require("../models");
const {
  user: User,
  role: Role,
  fines: Fines,
  order: Order,
  penaltyreason: PenaltyReason,
  book: Book,
  notification: Notification,
  bookset: BookSet,
} = db;

//get All fines
const getAllFines = async (req, res, next) => {
  try {
    const fines = await Fines.find({})
      .populate("user_id")
      .populate("book_id")
      .populate("order_id")
      .populate("fineReason_id")
      .populate("createBy")
      .populate("updateBy");

    if (!fines || fines.length === 0) {
      return res.status(404).json({
        message: "Get all fines failed",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get all fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error listing fines", error);
    res.status(500).send({ message: error.message });
  }
};

//get fines by id
const getFinesById = async (req, res, next) => {
  try {
    const { finesId } = req.params;
    const fines = await Fines.findById(finesId)
      .populate("user_id")
      .populate("book_id")
      .populate("order_id")
      .populate("fineReason_id")
      .populate("createBy")
      .populate("updateBy");
    if (!fines) {
      return res.status(404).json({
        message: "Fines not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting a fines", error);
    res.status(500).send({ message: error.message });
  }
};

//get fines by user id
const getFinesByUserId = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        data: null,
      });
    }

    const fines = await Fines.find({ user_id: userId })
      .populate("user_id")
      .populate("book_id")
      .populate("order_id")
      .populate("fineReason_id")
      .populate("createBy")
      .populate("updateBy");

    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting a fines", error);
    res.status(500).send({ message: error.message });
  }
};

//get fines by order id
const getFinesByOrderId = async (req, res, next) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({
        message: "Order not found",
        data: null,
      });
    }

    const fines = await Fines.find({ order_id: orderId })
      .populate("user_id")
      .populate("book_id")
      .populate("order_id")
      .populate("fineReason_id")
      .populate("createBy")
      .populate("updateBy");

    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting a fines", error);
    res.status(500).send({ message: error.message });
  }
};

//create fines
const createFines = async (req, res, next) => {
  try {
    const { user_id, order_id, fineReason_id, createBy, updateBy } = req.body;

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.findById(order_id).populate(
      "identifier_code condition"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const penaltyReason = await PenaltyReason.findById(fineReason_id).populate(
      "reasonName"
    );
    if (!penaltyReason) {
      return res.status(404).json({ message: "Penalty reason not found" });
    }

    const existingFines = await Fines.findOne({
      order_id,
    });

    if (existingFines) {
      return res.status(400).json({
        message: "Fines for this order already exists.",
        data: null,
      });
    }
    var totalAmount = 0;
    if (penaltyReason.type === "PN1") {
      const returnDateObj = new Date(order.returnDate);
      const dueDateObj = new Date(order.dueDate);

      const daysLate = Math.floor((returnDateObj - dueDateObj) / (1000 * 60 * 60 * 24));
      totalAmount = daysLate * penaltyReason.penaltyAmount;

    } else {
        const book = await Book.findById(order.book_id);
        const bookSet = await BookSet.findById(book.bookSet_id);
        totalAmount = penaltyReason.penaltyAmount * bookSet.price / 100;
    }
    const fines = new Fines({
      user_id,
      book_id: order.book_id,
      order_id,
      fineReason_id,
      createBy,
      updateBy,
      totalFinesAmount: totalAmount,
      status: "Pending",
      paymentMethod: null,
      paymentDate: null,
    });

    const newFines = await fines.save();

    const notification = new Notification({
      userId: user_id,
      type: "Fines",
      message: `You have been penalized ${penaltyReason.penaltyAmount}k for book #${order.book_id.identifier_code} for reason ${penaltyReason.reasonName}. Please pay to avoid additional fees.`,
    });
    await notification.save();

    res.status(201).json({
      message: "Create fines successfully",
      data: newFines,
    });
  } catch (error) {
    console.error("Error creating fines", error);
    res.status(500).send({ message: error.message });
  }
};

//filter fines by status
const filterFinesByStatus = async (req, res, next) => {
  try {
    const { status } = req.params;

    if (!["Pending", "Paid", "Overdue"].includes(status)) {
      return res.status(400).json({
        message: "Invalid status",
        data: null,
      });
    }
    const fines = await Fines.find({ status }).populate("user_id");

    if (!fines || fines.length === 0) {
      return res.status(404).json({
        message: "No fines found for the given status",
        data: null,
      });
    }
    res.status(200).json({
      message: "Get fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error getting a fines", error);
    res.status(500).send({ message: error.message });
  }
};

//update fines status
const updateFinesStatus = async (req, res, next) => {
  try {
    const { finesId } = req.params;
    const { status } = req.body;

    const validStatuses = ["Pending", "Paid", "Overdue"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        message: `Invalid status. Allowed statuses are: ${validStatuses.join(
          ", "
        )}`,
      });
    }
    const fines = await Fines.findById(finesId);
    if (!fines) {
      return res.status(404).json({
        message: "Fines not found",
        data: null,
      });
    }

    fines.status = status;
    await fines.save();

    res.status(200).json({
      message: "Update fines status successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error updating fines status", error);
    res.status(500).send({ message: error.message });
  }
};

//update fines
const updateFines = async (req, res, next) => {
  try {
    const { finesId } = req.params;
    const { user_id, order_id, fineReason_id, createBy, updateBy } = req.body;

    const fines = await Fines.findById(finesId);
    if (!fines) {
      return res.status(404).json({
        message: "Fines not found",
        data: null,
      });
    }

    const user = await User.findById(user_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const order = await Order.findById(order_id).populate(
      "identifier_code condition"
    );
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const penaltyReason = await PenaltyReason.findById(fineReason_id).populate(
      "reasonName"
    );
    if (!penaltyReason) {
      return res.status(404).json({ message: "Penalty reason not found" });
    }

    fines.user_id = user_id;
    fines.order_id = order_id;
    fines.fineReason_id = fineReason_id;
    fines.createBy = createBy;
    fines.updateBy = updateBy;
    fines.totalFinesAmount = penaltyReason.penaltyAmount;
    fines.status = "Pending";
    fines.paymentMethod = null;
    fines.paymentDate = null;

    const updatedFines = await fines.save();

    res.status(200).json({
      message: "Update fines successfully",
      data: updatedFines,
    });
  } catch (error) {
    console.error("Error updating fines", error);
    res.status(500).send({ message: error.message });
  }
};

//delete fines
const deleteFines = async (req, res, next) => {
  try {
    const { finesId } = req.params;
    const fines = await Fines.findByIdAndDelete(finesId);
    if (!fines) {
      return res.status(404).json({
        message: "Fines not found",
        data: null,
      });
    }

    res.status(200).json({
      message: "Delete fines successfully",
      data: fines,
    });
  } catch (error) {
    console.error("Error deleting fines", error);
    res.status(500).send({ message: error.message });
  }
};
const checkPayment = async (req, res, next) => {
  const { paymentKey } = req.params;
  const { fineId } = req.body;
  const sheetId = '1KnvznxmaALff3bQN0Nv4hU55MpnkhcOjJ8URzco6iL4';
  const apiKey = 'AIzaSyDrXD0uTwJImmMV_A7mrOXUPKbZOr8nBC8';
  const range = 'Casso!A2:F100';
  const url = `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values/${range}?key=${apiKey}`;

  try {
    const response = await axios.get(url);

    console.log("Data from Google Sheets API:", response.data);

    if (response.status === 200 && response.data.values) {
      let message = false;
      let amount = 0;

      response.data.values.forEach(value => {
        const matches = value[1].match(/start(.*?)end/);
        if (matches && paymentKey === matches[1].trim()) {
          message = true;
          amount = parseInt(value[2], 10) * 1000;
        }
      });

      if (message) {
        const fine = await Fines.findById(fineId);
        if (!fine) {
          return res.status(404).json({ error: "Fine not found" });
        }

        fine.status = 'Paid';
        fine.paymentMethod = 'Casso';
        fine.paymentDate = new Date();
        await fine.save();

        return res.status(200).json({ message: "OK", data: fine });
      } else {
        return res.status(500).json({ error: 'Không có giao dịch', data: response.data.values });
      }
    }

    return res.status(500).json({ error: 'Không thể lấy dữ liệu từ Google Sheets', data: response.data.values });

  } catch (error) {
    console.error("Error occurred:", error);
    return res.status(500).json({ error: 'Đã xảy ra lỗi trong quá trình xử lý' });
  }
};



const FinesController = {
  getAllFines,
  getFinesById,
  getFinesByUserId,
  getFinesByOrderId,
  createFines,
  updateFines,
  deleteFines,
  filterFinesByStatus,
  updateFinesStatus,
  checkPayment
};
module.exports = FinesController;
