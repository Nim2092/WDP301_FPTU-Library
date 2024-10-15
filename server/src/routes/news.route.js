const express = require("express");
const bodyParser = require("body-parser");
const newsController = require("../controllers/news.controller");

const newsRouter = express.Router();
newsRouter.use(bodyParser.json());

newsRouter.get("/list", newsController.listNews);

newsRouter.get("/get/:id", newsController.getNewsDetailById);

newsRouter.post("/create", newsController.createNews);

newsRouter.put("/update/:id", newsController.updateNews);

newsRouter.delete("/delete/:id", newsController.deleteNews);
module.exports = newsRouter;
