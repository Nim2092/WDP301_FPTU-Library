const express = require("express");
const bodyParser = require("body-parser");
const orderController = require("../controllers/order.controller");

const orderRouter = express.Router();
orderRouter.use(bodyParser.json());

orderRouter.get("/getAll", orderController.getAllOrder);

orderRouter.get("/by-order/:orderId", orderController.getOrderById);

orderRouter.get("/by-user/:userId", orderController.getOrderByUserId);

orderRouter.post("/create-borrow/:bookId", orderController.createBorrowOrder);
module.exports = orderRouter;
