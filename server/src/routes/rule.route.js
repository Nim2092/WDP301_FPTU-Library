const express = require("express");
const bodyParser = require("body-parser");
const ruleController = require("../controllers/rule.controller");

const ruleRouter = express.Router();
ruleRouter.use(bodyParser.json());

module.exports = ruleRouter;
