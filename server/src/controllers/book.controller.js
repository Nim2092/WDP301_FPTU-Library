const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, book: Book, bookset: BookSet } = db;

const updateBook = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { condition } = req.body;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        book.condition = condition || book.condition;

        const updatedBook = await book.save();

        return res.status(200).json({ message: "Book updated successfully", updatedBook });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const deleteBook = async (req, res, next) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id);
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        const bookSet = await BookSet.findById(book.bookSet_id);
        if (!bookSet) {
            return res.status(404).json({ message: "BookSet not found." });
        }

        await book.deleteOne();

        bookSet.totalCopies -= 1;
        await bookSet.save();

        return res.status(200).json({ message: "Book deleted successfully", updatedBookSet: bookSet });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};


const getBookDetail = async (req, res, next) => {
    try {
        const { id } = req.params;

        const book = await Book.findById(id).populate({ path: "bookSet_id", model: "BookSet" });
        if (!book) {
            return res.status(404).json({ message: "Book not found." });
        }

        return res.status(200).json({ message: "Book details retrieved successfully", book });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

const BookController = {
    updateBook,
    deleteBook,
    getBookDetail
};
module.exports = BookController;
