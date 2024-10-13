const express = require("express");
const bodyParser = require("body-parser");
const BookSetController = require("../controllers/bookset.controller");

const bookSetRouter = express.Router();
bookSetRouter.use(bodyParser.json());

module.exports = bookSetRouter;
