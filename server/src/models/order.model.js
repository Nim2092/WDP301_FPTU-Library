const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    book_id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: {
      type: String,
      enum: [
        "Pending",
        "Approved",
        "Rejected",
        "Received",
        "Canceled",
        "Returned",
        "Overdue",
        "Lost",
        "Renew Pending",
      ],
      required: true,
    },
    requestDate: { type: Date, required: true },
    borrowDate: Date,
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    renew_reason: String,
    reason_order: String,
    renewalCount: Number,
    renewalDate: Date,
    book_condition_detail: String,
  },
  { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
