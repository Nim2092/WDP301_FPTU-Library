const mongoose = require("mongoose");
const { Schema } = mongoose;

const catalogSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: Number, required: true, unique: true },
    major: String,
    semester: Number,
    isTextbook: { type: Number, required: true },
    created_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
    updated_by: { type: Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

const Catalog = mongoose.model("Catalog", catalogSchema);

module.exports = Catalog;
