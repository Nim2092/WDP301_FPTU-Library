const mongoose = require("mongoose");
const { Schema } = mongoose;

const penaltyReasonSchema = new Schema({
  reasonName: { type: String, required: true },
  penaltyAmount: { type: Number, required: true },
});

const PenaltyReason = mongoose.model("penaltyReason", penaltyReasonSchema);

module.exports = PenaltyReason;
