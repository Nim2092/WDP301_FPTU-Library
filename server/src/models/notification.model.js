const mongoose = require("mongoose");
const { Schema } = mongoose;

const notificationSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    orderId: { type: Schema.Types.ObjectId, ref: "Order", required: false },
    type: {
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
        "Reminder",
        "Fines",
      ],
      required: true,
    },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Notification = mongoose.model("Notification", notificationSchema);
module.exports = Notification;
