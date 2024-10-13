const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, book: Book } = db;

const BookController = {};
module.exports = BookController;
