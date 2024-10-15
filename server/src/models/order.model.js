const mongoose = require("mongoose");
const { Schema } = mongoose;

const orderSchema = new Schema(
  {
    book_id: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    status: { type: Number, required: true },
    requestDate: { type: Date, required: true },
    borrowDate: { type: Date, required: true },
    dueDate: { type: Date, required: true },
    returnDate: { type: Date },
    reason_order: String,
    renewalCount: Number,
    renewalDate: Date,
  },
  { timestamps: true }
);

const Order = mongoose.model("order", orderSchema);

module.exports = Order;
