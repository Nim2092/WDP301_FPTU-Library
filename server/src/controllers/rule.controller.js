const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, rule: Rule } = db;

//list rule
async function listRule(req, res, next) {
  try {
    const listRule = await Rule.find();

    if (!listRule) {
      return res.status(404).send({ message: "Rule not found" });
    }
    const newListRule = listRule.map((rule) => ({
      id: rule.id,
      title: rule.title,
      content: rule.content,
      createdBy: rule.createdBy,
      updatedBy: rule.updatedBy,
    }));
    res.status(200).json({
      message: "Get list rule successfully",
      data: newListRule,
    });
  } catch (error) {
    console.error("Error listing rule", error);
    res.status(500).send({ message: error.message });
  }
}

//get rule by id
async function getRuleDetailById(req, res, next) {
  try {
    const { id } = req.params;
    const rule = await Rule.findById(id);
    if (!rule) {
      return res.status(404).send({ message: "Rule not found" });
    }
    res.status(200).json({
      message: "Get rule successfully",
      data: rule,
    });
  } catch (error) {
    console.error("Error getting rule", error);
    res.status(500).send({ message: error.message });
  }
}

//create a rule
async function createRule(req, res, next) {
  try {
    const { title, content, createdBy, updatedBy } = req.body;
    if (!title || !content) {
      return res
        .status(400)
        .send({ message: "Tiêu đề và nội dung là bắt buộc" });
    }
    const rule = new Rule({
      title: title,
      content: content,
      createdBy: createdBy,
      updatedBy: updatedBy,
    });
    const savedRule = await rule.save();
    res.status(201).json({
      message: "Tạo quy định thành công",
      data: savedRule,
    });
  } catch (error) {
    console.error("Error creating rule", error);
    res.status(500).send({ message: error.message });
  }
}

//update a rule with id
async function updateRule(req, res, next) {
  try {
    const { id } = req.params;
    const { title, content, updatedBy } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .send({ message: "Tiêu đề và nội dung là bắt buộc" });
    }

    const rule = await Rule.findByIdAndUpdate(
      id,
      { title, content, updatedBy: /* req.user.id */ updatedBy },
      { new: true }
    );
    if (!rule) {
      return res.status(404).send({ message: "Không tìm thấy quy định" });
    }
    res.status(200).json({
      message: "Cập nhật quy định thành công",
      data: rule,
    });
  } catch (error) {
    console.error("Error updating rule", error);
    res.status(500).send({ message: error.message });
  }
}

//delete a rule with id
async function deleteRule(req, res, next) {
  try {
    const { id } = req.params;
    const rule = await Rule.findByIdAndDelete(id);
    if (!rule) {
      return res.status(404).send({ message: "Không tìm thấy quy định" });
    }
    res.status(200).json({
      message: "Xóa quy định thành công",
      data: rule,
    });
  } catch (error) {
    console.error("Error deleting rule", error);
    res.status(500).send({ message: error.message });
  }
}

const RuleController = {
  listRule,
  createRule,
  updateRule,
  deleteRule,
  getRuleDetailById,
};
module.exports = RuleController;
