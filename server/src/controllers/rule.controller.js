const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, rule: Rule } = db;

const RuleController = {};
module.exports = RuleController;
