const mongoose = require("mongoose");

const User = require("./user.model");
const Role = require("./role.model");
const Catalog = require("./catalog.model");
const Book = require("./book.model");
const BookSet = require("./bookset.model");
const Fines = require("./fines.model");
const News = require("./news.model");
const Order = require("./order.model");
const PenaltyReason = require("./penaltyreason.model");
const Rule = require("./rule.model");

// Khai bao doi tuong mongoose su dung nhu moi bien global
mongoose.Promise = global.Promise;
// Khai bao 1 doi tuong dai dien db
const db = {};
// Bo sung cac thuoc tinh cho db
db.mongoose = mongoose;
db.user = User;
db.role = Role;
db.catalog = Catalog;
db.book = Book;
db.bookset = BookSet;
db.fines = Fines;
db.news = News;
db.order = Order;
db.penaltyreason = PenaltyReason;
db.rule = Rule;

db.connectDB = async () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: process.env.DB_NAME,
    })
    .then(() => console.log("Connect to mongodb success"))
    .catch((error) => console.error(error.message));
};

module.exports = db;
