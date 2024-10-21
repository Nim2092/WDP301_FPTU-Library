const mongoose = require("mongoose");
const { Schema } = mongoose;

const catalogSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: Number, required: true, unique: true },
    major: String,
    semester: Number,
    isTextbook: { type: Number, required: true },
  },
  { timestamps: true }
);

const Catalog = mongoose.model("Catalog", catalogSchema);

module.exports = Catalog;
