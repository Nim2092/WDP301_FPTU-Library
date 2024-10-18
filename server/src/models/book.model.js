const mongoose = require("mongoose");
const { Schema } = mongoose;

const bookSchema = new Schema(
  {
    bookSet_id: { type: Schema.Types.ObjectId, ref: "BookSet", required: true },
    identifier_code: { type: String, required: true, unique: true },
    condition: { type: String, required: true },
  },
  { timestamps: true }
);

const Book = mongoose.model("Book", bookSchema);

module.exports = Book;
