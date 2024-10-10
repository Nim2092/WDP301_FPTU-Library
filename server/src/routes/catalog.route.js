const express = require('express');
const bodyParser = require("body-parser");
const catalogController = require('../controllers/catalog.controller');

const catalogRouter = express.Router();
catalogRouter.use(bodyParser.json());


module.exports = catalogRouter;
