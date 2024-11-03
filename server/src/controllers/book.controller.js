const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, book: Book, bookset: BookSet } = db;

const updateBook = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { condition, condition_detail, status, updatedBy } = req.body;

    const book = await Book.findById(id);
    if (!book) {
      return res.status(404).json({ message: "Không tìm thấy sách." });
    }
    var update_status = status;
    if(book.status !== 'Destroyed' && (condition === 'Lost' || condition === 'Hard')) {
      const bookSet = await BookSet.findById(book.bookSet_id);
      bookSet.availableCopies -= 1;
      bookSet.save();
      update_status = 'Destroyed';
    }
    if(book.status === 'Destroyed' && (condition === 'Good' || condition === 'Light' || condition === 'Medium')) {
      const bookSet = await BookSet.findById(book.bookSet_id);
      bookSet.availableCopies += 1;
      bookSet.save();
    }
    book.condition = condition || book.condition;
    book.condition_detail = condition_detail || book.condition_detail;
    book.status = update_status || book.status;
    book.updated_by = updatedBy || book.updated_by;

    const updatedBook = await book.save();

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
    if(book.condition !== 'Hard' && book.condition !== 'Lost') {
      bookSet.availableCopies -= 1;
    }
    await bookSet.save();

    return res
      .status(200)
      .json({ message: "Xóa sách thành công", updatedBookSet: bookSet });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Đã xảy ra lỗi", error: error.message });
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
const listBooks = async (req, res) => {
  try {
    const { condition, status, bookSet_id, identifier_code, page = 1, limit = 10 } = req.body;
    let filter = {};

    // Kiểm tra từng điều kiện và thêm vào filter nếu có
    if (condition) {
      filter.condition = condition;
    }
    if (status) {
      filter.status = status;
    }
    if (bookSet_id) {
      filter.bookSet_id = bookSet_id;
    }
    if (identifier_code) {
      filter.identifier_code = identifier_code;
    }

    // Tính toán số lượng bản ghi cần skip dựa trên trang và giới hạn
    const skip = (page - 1) * limit;

    // Tìm kiếm sách dựa trên filter, áp dụng phân trang
    const books = await Book.find(filter)
        .populate('bookSet_id', 'title') // Populate để lấy thông tin tiêu đề của bộ sách nếu cần
        .populate('created_by', 'name') // Populate thông tin người tạo nếu cần
        .populate('updated_by', 'name') // Populate thông tin người cập nhật nếu cần
        .skip(skip)
        .limit(parseInt(limit));

    // Lấy tổng số lượng sách thoả mãn điều kiện để tính tổng số trang
    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    return res.status(200).json({
      message: "Danh sách sách được lọc và phân trang thành công.",
      data: books,
      pagination: {
        currentPage: page,
        totalPages,
        totalBooks,
      },
    });
  } catch (error) {
    console.error("Error retrieving books:", error);
    return res.status(500).json({
      message: "Có lỗi xảy ra khi lấy danh sách sách.",
      error: error.message,
    });
  }
};


const BookController = {
  updateBook,
  deleteBook,
  getBookDetail,
  listBooks
};
module.exports = BookController;
