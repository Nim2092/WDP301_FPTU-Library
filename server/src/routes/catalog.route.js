const express = require('express');
const bodyParser = require("body-parser");
const catalogController = require('../controllers/catalog.controller');

const catalogRouter = express.Router();
catalogRouter.use(bodyParser.json());

catalogRouter.post("/create", catalogController.createCatalog);
catalogRouter.put("/update/:id", catalogController.updateCatalog);
catalogRouter.get("/list", catalogController.listCatalogs);
catalogRouter.delete("/delete/:id", catalogController.deleteCatalog);


module.exports = catalogRouter;
