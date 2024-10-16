const { default: mongoose } = require("mongoose");
const db = require("../models");
const {
  user: User,
  role: Role,
  fines: Fines,
  order: Order,
  penaltyreason: PenaltyReason,
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
    const { user_id, book_id, order_id, fineReason_id } = req.body;

    const createBy = req.user.id;
    const updateBy = req.user.id;

    const penaltyReason = await PenaltyReason.findById(fineReason_id);
    if (!penaltyReason) {
      return res.status(404).json({ message: "Penalty reason not found" });
    }

    const fines = new Fines({
      user_id,
      book_id,
      order_id,
      fineReason_id,
      createBy,
      updateBy,
      totalFinesAmount: penaltyReason.penaltyAmount,
      status: 0,
      paymentMethod: null,
      paymentDate: null,
    });

    const newFines = await fines.save();

    await Order.findByIdAndUpdate(order_id, { status: 6 });

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
    const fines = await Fines.find({ status }).populate("user_id");

    if (!fines || fines.length === 0) {
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

const FinesController = {
  getAllFines,
  getFinesById,
  getFinesByUserId,
  getFinesByOrderId,
  createFines,
  filterFinesByStatus,
};
module.exports = FinesController;
