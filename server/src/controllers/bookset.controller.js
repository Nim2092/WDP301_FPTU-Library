const { bookset: BookSet, book: Book, catalog: Catalog } = require("../models");

async function createBookSet(req, res, next) {
    try {
        const {
            catalog_id,
            isbn,
            code,
            shelfLocationCode,
            title,
            author,
            publishedYear,
            publisher,
            physicalDescription,
            totalCopies,
            availableCopies,
        } = req.body;

        if (!catalog_id || !isbn || !title || !author || !publishedYear || !publisher || !physicalDescription || !shelfLocationCode || !totalCopies || !availableCopies) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const catalog = await Catalog.findById(catalog_id);
        if (!catalog) {
            return res.status(404).json({ message: "Catalog not found." });
        }

        const catalogCode = catalog.code;

        const newBookSet = new BookSet({
            catalog_id,
            isbn,
            code,
            shelfLocationCode,
            title,
            author,
            publishedYear,
            publisher,
            physicalDescription,
            totalCopies,
            availableCopies,
        });

        const savedBookSet = await newBookSet.save();

        const books = [];
        for (let i = 0; i < totalCopies; i++) {
            let identifierCode;
            let isUnique = false;

            while (!isUnique) {
                const randomCode = Math.floor(1000 + Math.random() * 9000);
                identifierCode = `${catalogCode}.${code}.${randomCode}`;

                const existingBook = await Book.findOne({ identifier_code: identifierCode });
                if (!existingBook) {
                    isUnique = true;
                }
            }

            const newBook = new Book({
                bookSet_id: savedBookSet._id,
                identifier_code: identifierCode,
                condition: "Good",
            });

            books.push(newBook.save());
        }

        const savedBooks = await Promise.all(books);

        return res.status(201).json({ message: "BookSet and Books created successfully", savedBookSet, books: savedBooks });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "Book with this ISBN or identifier code already exists." });
        }

        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

const BookSetController = {
    createBookSet,
};

module.exports = BookSetController;
