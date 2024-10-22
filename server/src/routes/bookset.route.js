const express = require("express");
const bodyParser = require("body-parser");
const BookSetController = require("../controllers/bookset.controller");

const bookSetRouter = express.Router();
bookSetRouter.use(bodyParser.json());

bookSetRouter.post("/create", BookSetController.createBookSet);
bookSetRouter.post("/add-books", BookSetController.addBooks);
bookSetRouter.put("/update/:id", BookSetController.updateBookSet);
bookSetRouter.get("/list", BookSetController.listBookSet);
bookSetRouter.get("/:id", BookSetController.getBookSetDetail);
bookSetRouter.delete("/delete/:id", BookSetController.deleteBookSet);
bookSetRouter.get("/available/:id", BookSetController.getBookSetDetailAvailable);
module.exports = bookSetRouter;
