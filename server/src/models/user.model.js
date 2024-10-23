const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema(
  {
    role_id: { type: Schema.Types.ObjectId, ref: "role", required: true },
    code: { type: String, required: true, unique: true },
    fullName: String,
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phoneNumber: Number,
    image: String,
    createdBy: { type: Schema.Types.ObjectId, ref: "User" }, // Reference to the user who created this entry
    updatedBy: { type: Schema.Types.ObjectId, ref: "User" },
    isActive: { type: Boolean, default: true },
    cancelCount: { type: Number, default: 0 },
    resetPasswordToken: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
