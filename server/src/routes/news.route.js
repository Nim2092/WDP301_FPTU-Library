const express = require("express");
const bodyParser = require("body-parser");
const newsController = require("../controllers/news.controller");

const newsRouter = express.Router();
newsRouter.use(bodyParser.json());

module.exports = newsRouter;
