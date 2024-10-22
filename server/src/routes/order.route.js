const express = require("express");
const bodyParser = require("body-parser");
const orderController = require("../controllers/order.controller");

const orderRouter = express.Router();
orderRouter.use(bodyParser.json());

orderRouter.get("/getAll", orderController.getAllOrder);

orderRouter.get("/by-order/:orderId", orderController.getOrderById);

orderRouter.get("/by-user/:userId", orderController.getOrderByUserId);

orderRouter.post("/create-borrow/:bookId", orderController.createBorrowOrder);

orderRouter.put("/change-status/:orderId", orderController.changeOrderStatus);

orderRouter.post("/renew/:orderId", orderController.renewOrder);

orderRouter.post("/return/:orderId", orderController.returnOrder);

orderRouter.get("/filter", orderController.filterOrdersByStatus);

orderRouter.put("/cancel/:orderId", orderController.cancelOrder);

orderRouter.put("/report-lost/:orderId", orderController.reportLostBook);

orderRouter.post("/lost-fines/:orderId", orderController.applyFinesForLostBook);
module.exports = orderRouter;
