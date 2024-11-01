const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, book: Book, bookset: BookSet } = db;

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { condition } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }

    book.condition = condition || book.condition;

    const updatedBook = await book.save();
    // Nếu status = Lost hoac hỏng thì -1 ở availableCopies của bookset

    return res
      .status(200)
      .json({ message: "Cập nhật sách thành công", updatedBook });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi", error: error.message });
  }
};

const deleteBook = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }

    const bookSet = await BookSet.findById(book.bookSet_id);
    if (!bookSet) {
      return res.status(404).json({ message: "Không tìm thấy bộ sách." });
    }

    await book.deleteOne();

    bookSet.totalCopies -= 1;
    await bookSet.save();

    return res
      .status(200)
      .json({ message: "Xóa sách thành công", updatedBookSet: bookSet });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const getBookDetail = async (req, res, next) => {
  try {
    const { id } = req.params;

    const book = await Book.findById(id).populate({
      path: "bookSet_id",
      model: "BookSet",
    });
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }

    return res
      .status(200)
      .json({ message: "Lấy thông tin sách thành công", book });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "An error occurred", error: error.message });
  }
};

const BookController = {
  updateBook,
  deleteBook,
  getBookDetail,
};
module.exports = BookController;
