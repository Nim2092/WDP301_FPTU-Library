const mongoose = require("mongoose");
const { Schema } = mongoose;

const ruleSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
  },
  { timestamps: true }
);

const Rule = mongoose.model("Rule", ruleSchema);

module.exports = Rule;
