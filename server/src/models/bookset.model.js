const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSetSchema = new Schema(
  {
    catalog_id: { type: Schema.Types.ObjectId, ref: "Catalog", required: true },
    isbn: { type: String, required: true, unique: true },
    code: { type: String, required: true, unique: true },
    shelfLocationCode: { type: String, required: true },
    title: { type: String, required: true },
    author: { type: String, required: true },
    publishedYear: { type: Date, required: true },
    publisher: { type: String, required: true },
    physicalDescription: { type: String, required: true },
    totalCopies: { type: Number, required: true },
    availableCopies: { type: Number, required: true },
  },
  { timestamps: true }
);

const BookSet = mongoose.model("BookSet", bookSetSchema);

module.exports = BookSet;
