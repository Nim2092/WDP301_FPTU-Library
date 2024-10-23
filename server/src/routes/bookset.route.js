const express = require("express");
const bodyParser = require("body-parser");
const BookSetController = require("../controllers/bookset.controller");
const upload = require("../middlewares/upload");

const bookSetRouter = express.Router();
bookSetRouter.use(bodyParser.json());

bookSetRouter.post(
  "/create",
  upload.single("image"),
  BookSetController.createBookSet
);

bookSetRouter.put(
  "/update/:id",
  upload.single("image"),
  BookSetController.updateBookSet
);

bookSetRouter.post("/add-books", BookSetController.addBooks);

bookSetRouter.get("/list", BookSetController.listBookSet);

bookSetRouter.get("/:id", BookSetController.getBookSetDetail);

bookSetRouter.delete("/delete/:id", BookSetController.deleteBookSet);

bookSetRouter.get(
  "/available/:id",
  BookSetController.getBookSetDetailAvailable
);

bookSetRouter.get("/image/:id", BookSetController.getImageById);

module.exports = bookSetRouter;
