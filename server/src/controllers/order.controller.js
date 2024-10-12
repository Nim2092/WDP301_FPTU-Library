const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, order: Order } = db;

const OrderController = {};
module.exports = OrderController;
