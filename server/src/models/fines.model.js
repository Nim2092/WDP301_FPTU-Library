const mongoose = require("mongoose");
const { Schema } = mongoose;

const finesSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: "User", required: true },
    book_id: { type: Schema.Types.ObjectId, ref: "Book" },
    order_id: { type: Schema.Types.ObjectId, ref: "Order", required: true },
    fineReason_id: {
      type: Schema.Types.ObjectId,
      ref: "PenaltyReason",
      required: true,
    },
    createBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updateBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalFinesAmount: { type: Number, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Paid", "Overdue"],
      required: true,
      default: "Pending",
    },
    paymentMethod: { type: String, default: null },
    paymentDate: { type: Date, default: null },
  },
  { timestamps: true }
);

const Fines = mongoose.model("Fines", finesSchema);

module.exports = Fines;
