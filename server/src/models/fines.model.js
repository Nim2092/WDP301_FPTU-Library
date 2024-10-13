const mongoose = require("mongoose");
const { Schema } = mongoose;

const finesSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book_id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    fineReason_id: {
      type: Schema.Types.ObjectId,
      ref: "PenaltyReason",
      required: true,
    },
    createBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updateBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalFinesAmount: { type: Number, required: true },
    status: { type: Number, required: true },
    paymentMethod: String,
    paymentDate: Date,
  },
  { timestamps: true }
);

const Fines = mongoose.model("Fines", finesSchema);

module.exports = Fines;
