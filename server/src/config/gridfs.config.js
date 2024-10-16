const mongoose = require("mongoose");
const Grid = require("gridfs-stream");

let gfs;
const connection = mongoose.connection;

connection.once("open", () => {
  gfs = Grid(connection.db, mongoose.mongo);
  gfs.collection("uploads"); // Tạo collection để lưu file
});

module.exports = { gfs };
