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
        } = req.body;
        console.log(req.body);

        if (!catalog_id || !code || !isbn || !title || !author || !publishedYear || !publisher || !physicalDescription || !shelfLocationCode || !totalCopies) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const catalog = await Catalog.findById(catalog_id);
        if (!catalog) {
            return res.status(404).json({ message: "Catalog not found." });
        }

        const catalogCode = catalog.code;
        var availableCopies = totalCopies;
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
                status: "Available",
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
async function updateBookSet(req, res, next) {
    try {
        const { id } = req.params;
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

        if (!catalog_id || !isbn || !title || !author || !publishedYear || !publisher || !physicalDescription || !shelfLocationCode) {
            return res.status(400).json({ message: "All fields are required." });
        }

        const catalog = await Catalog.findById(catalog_id);
        if (!catalog) {
            return res.status(404).json({ message: "Catalog not found." });
        }

        const catalogCode = catalog.code;

        const updatedBookSet = await BookSet.findByIdAndUpdate(
            id,
            {
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
            },
            { new: true, runValidators: true }
        );

        if (!updatedBookSet) {
            return res.status(404).json({ message: "BookSet not found." });
        }

        return res.status(200).json({ message: "BookSet updated successfully", updatedBookSet });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ message: "BookSet with this ISBN already exists." });
        }

        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

async function listBookSet(req, res, next) {
    try {
        const { page = 1, limit = 10, title, author, pubYear, publisher, catalog_id } = req.query;

        const query = {};

        if (catalog_id) {
            query.catalog_id = catalog_id;
        }
        if (title) {
            query.title = { $regex: new RegExp(title, 'i') };
        }
        if (author) {
            query.author = { $regex: new RegExp(author, 'i') };
        }
        if (pubYear) {
            query.publishedYear = new Date(pubYear);
        }
        if (publisher) {
            query.publisher = { $regex: new RegExp(publisher, 'i') };
        }

        const skip = (page - 1) * limit;

        const bookSets = await BookSet.find(query)
            .populate('catalog_id')
            .skip(skip)
            .limit(parseInt(limit))
            .sort({ createdAt: -1 });

        const totalBookSets = await BookSet.countDocuments(query);

        return res.status(200).json({
            message: "BookSets fetched successfully",
            data: bookSets,
            total: totalBookSets,
            currentPage: parseInt(page),
            totalPages: Math.ceil(totalBookSets / limit),
        });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}


async function getBookSetDetail(req, res, next) {
    try {
        const { id } = req.params;

        const bookSet = await BookSet.findById(id)
            .populate({ path: 'catalog_id', model: 'Catalog', select: 'name code' });

        if (!bookSet) {
            return res.status(404).json({ message: "BookSet not found." });
        }

        const books = await Book.find({ bookSet_id: id });

        return res.status(200).json({ bookSet, books });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

const addBooks = async (req, res, next) => {
    try {
        const {
            bookSet_id,
            numberOfCopies
        } = req.body;

        if (!bookSet_id || !numberOfCopies) {
            return res.status(400).json({ message: "BookSet ID and number of copies are required." });
        }

        const bookSet = await BookSet.findById(bookSet_id);
        if (!bookSet) {
            return res.status(404).json({ message: "BookSet not found." });
        }

        const catalog = await Catalog.findById(bookSet.catalog_id);
        if (!catalog) {
            return res.status(404).json({ message: "Catalog not found." });
        }

        const catalogCode = catalog.code;

        const books = [];
        for (let i = 0; i < numberOfCopies; i++) {
            let identifierCode;
            let isUnique = false;

            while (!isUnique) {
                const randomCode = Math.floor(1000 + Math.random() * 9000);
                identifierCode = `${catalogCode}.${bookSet.code}.${randomCode}`;

                const existingBook = await Book.findOne({ identifier_code: identifierCode });
                if (!existingBook) {
                    isUnique = true;
                }
            }

            const newBook = new Book({
                bookSet_id: bookSet._id,
                identifier_code: identifierCode,
                condition: "Good",
                status: "Available",
            });

            books.push(newBook.save());
        }

        const savedBooks = await Promise.all(books);

        bookSet.totalCopies += numberOfCopies;
        bookSet.availableCopies += numberOfCopies;
        await bookSet.save();

        return res.status(201).json({ message: "Books added successfully", books: savedBooks });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
};

async function deleteBookSet(req, res, next) {
    try {
        const { id } = req.params;

        const bookSet = await BookSet.findById(id);
        if (!bookSet) {
            return res.status(404).json({ message: "BookSet not found." });
        }

        await Book.deleteMany({ bookSet_id: id });

        await BookSet.findByIdAndDelete(id);

        return res.status(200).json({ message: "BookSet and related Books deleted successfully." });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}
async function getBookSetDetailAvailable(req, res, next) {
    try {
        const { id } = req.params;

        // Fetch the BookSet by its ID
        const bookSet = await BookSet.findById(id)
            .populate({ path: 'catalog_id', model: 'Catalog', select: 'name code' });

        if (!bookSet) {
            return res.status(404).json({ message: "BookSet not found." });
        }

        // Fetch only the books with status 'Available' for this BookSet
        const availableBooks = await Book.find({ bookSet_id: id, status: "Available" });

        return res.status(200).json({ bookSet, availableBooks });
    } catch (error) {
        return res.status(500).json({ message: "An error occurred", error: error.message });
    }
}

const BookSetController = {
    createBookSet,
    updateBookSet,
    listBookSet,
    getBookSetDetail,
    addBooks,
    deleteBookSet,
    getBookSetDetailAvailable
};

module.exports = BookSetController;
