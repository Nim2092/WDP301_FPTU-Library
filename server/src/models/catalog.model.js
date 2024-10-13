const mongoose = require("mongoose");
const { Schema } = mongoose;

const catalogSchema = new Schema(
  {
    name: { type: String, required: true },
    code: { type: Number, required: true, unique: true },
    major: String,
    semester: Number,
  },
  { timestamps: true }
);

const Catalog = mongoose.model("catalog", catalogSchema);

module.exports = Catalog;
