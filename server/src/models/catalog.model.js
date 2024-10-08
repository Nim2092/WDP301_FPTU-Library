const mongoose = require("mongoose");
const {Schema} = mongoose;

const catalogSchema = new Schema({
    name: String,
    code: Number,
    major: String,
    semester: Number,
    createdAt: Date,
    updatedAt: Date
});

const Catalog = mongoose.model('catalog', catalogSchema);

module.exports = Catalog;