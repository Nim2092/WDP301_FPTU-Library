const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, fines: Fines } = db;

const FinesController = {};
module.exports = FinesController;
