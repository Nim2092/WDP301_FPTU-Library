const express = require("express");
const bodyParser = require("body-parser");
const bookController = require("../controllers/book.controller");

const bookRouter = express.Router();
bookRouter.use(bodyParser.json());

module.exports = bookRouter;
