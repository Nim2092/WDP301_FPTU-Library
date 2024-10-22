const { default: mongoose } = require("mongoose");
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
      "book_id",
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

    const fines = new Fines({
      user_id,
      order_id,
      fineReason_id,
      createBy,
      updateBy,
      totalFinesAmount: penaltyReason.penaltyAmount,
      status: "Pending",
      paymentMethod: null,
      paymentDate: null,
    });

    const newFines = await fines.save();

    const notification = new Notification({
      userId: user_id,
      type: "Fines",
      message: `Bạn đã bị phạt ${penaltyReason.penaltyAmount}k cho sách #${order.book_id.identifier_code} vì lý do ${penaltyReason.reasonName}. Vui lòng thanh toán để tránh thêm phí.`,
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

    if (!["pending", "paid", "overdue"].includes(status)) {
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

const FinesController = {
  getAllFines,
  getFinesById,
  getFinesByUserId,
  getFinesByOrderId,
  createFines,
  filterFinesByStatus,
};
module.exports = FinesController;
