const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, penaltyreason: PenaltyReason } = db;

//list all penalty reasons
const listPenaltyReasons = async (req, res) => {
  try {
    const penaltyReasons = await PenaltyReason.find();
    res.status(200).json({
      message: "Get penalty reasons successfully",
      data: penaltyReasons,
    });
  } catch (error) {
    console.error("Error getting penalty reasons", error);
    res.status(500).send({ message: error.message });
  }
};

//get penalty reasons by id
const getPenaltyReasonsById = async (req, res) => {
  try {
    const { id } = req.params;
    const penaltyReason = await PenaltyReason.findById(id);
    if (!penaltyReason) {
      return res.status(404).send({ message: "Penalty reason not found" });
    }
    res.status(200).json({
      message: "Get penalty reason successfully",
      data: penaltyReason,
    });
  } catch (error) {
    console.error("Error getting penalty reason", error);
    res.status(500).send({ message: error.message });
  }
};

//create a penalty reason
const createPenaltyReasons = async (req, res) => {
  try {
    const { reasonName, penaltyAmount, type } = req.body;
    if (!reasonName || !penaltyAmount) {
      return res
        .status(400)
        .send({ message: "Tên lý do và số tiền phạt là bắt buộc" });
    }
    const penaltyReason = new PenaltyReason({
      reasonName,
      penaltyAmount,
      type,
    });
    await penaltyReason.save();
    res.status(201).json({
      message: "Create penalty reason successfully",
      data: penaltyReason,
    });
  } catch (error) {
    console.error("Error creating penalty reason", error);
    res.status(500).send({ message: error.message });
  }
};

//update a penalty reason
const updatePenaltyReasons = async (req, res) => {
  try {
    const { id } = req.params;
    const { reasonName, penaltyAmount } = req.body;
    const penaltyReason = await PenaltyReason.findById(id);
    if (!penaltyReason) {
      return res.status(404).send({ message: "Penalty reason not found" });
    }
    penaltyReason.reasonName = reasonName;
    penaltyReason.penaltyAmount = penaltyAmount;
    await penaltyReason.save();
    res.status(200).json({
      message: "Update penalty reason successfully",
      data: penaltyReason,
    });
  } catch (error) {
    console.error("Error updating penalty reason", error);
    res.status(500).send({ message: error.message });
  }
};

//delete a penalty reason
const deletePenaltyReasons = async (req, res) => {
  try {
    const { id } = req.params;
    const penaltyReason = await PenaltyReason.findByIdAndDelete(id);
    if (!penaltyReason) {
      return res.status(404).send({ message: "Penalty reason not found" });
    }
    res.status(200).json({
      message: "Delete penalty reason successfully",
      data: penaltyReason,
    });
  } catch (error) {
    console.error("Error deleting penalty reason", error);
    res.status(500).send({ message: error.message });
  }
};

const PenaltyReasonController = {
  listPenaltyReasons,
  getPenaltyReasonsById,
  createPenaltyReasons,
  updatePenaltyReasons,
  deletePenaltyReasons,
};
module.exports = PenaltyReasonController;
