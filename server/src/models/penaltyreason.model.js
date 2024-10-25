const mongoose = require("mongoose");
const { Schema } = mongoose;

const penaltyReasonSchema = new Schema({
  reasonName: { type: String, required: true },
  penaltyAmount: { type: Number, required: true },
  type: { type: String, required: true },
});

const PenaltyReason = mongoose.model("PenaltyReason", penaltyReasonSchema);

module.exports = PenaltyReason;
