const express = require("express");
const bodyParser = require("body-parser");
const bookController = require("../controllers/book.controller");

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

bookRouter.put("/update/:id", bookController.updateBook);
bookRouter.delete("/delete/:id", bookController.deleteBook);
bookRouter.get("/:id", bookController.getBookDetail);
module.exports = bookRouter;
