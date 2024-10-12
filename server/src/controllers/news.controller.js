const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, news: News } = db;

const NewsController = {};
module.exports = NewsController;
