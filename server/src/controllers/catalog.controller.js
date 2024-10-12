const { default: mongoose } = require("mongoose");
const db = require("../models");
const { user: User, role: Role, catalog: Catalog } = db;

const CatalogController = {};
module.exports = CatalogController;
