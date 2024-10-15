const express = require("express");
const bodyParser = require("body-parser");
const ruleController = require("../controllers/rule.controller");

const ruleRouter = express.Router();
ruleRouter.use(bodyParser.json());

ruleRouter.get("/list", ruleController.listRule);

ruleRouter.get("/get/:id", ruleController.getRuleDetailById);

ruleRouter.post("/create", ruleController.createRule);

ruleRouter.put("/update/:id", ruleController.updateRule);

ruleRouter.delete("/delete/:id", ruleController.deleteRule);

module.exports = ruleRouter;
