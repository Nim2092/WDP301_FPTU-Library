const express = require("express");
const bodyParser = require("body-parser");
const finesController = require("../controllers/fines.controller");

const finesRouter = express.Router();
finesRouter.use(bodyParser.json());

finesRouter.get("/getAll", finesController.getAllFines);

finesRouter.get("/get/:finesId", finesController.getFinesById);

finesRouter.get("/by-user/:userId", finesController.getFinesByUserId);

finesRouter.get("/by-order/:orderId", finesController.getFinesByOrderId);

finesRouter.post("/create", finesController.createFines);

finesRouter.put("/update/:finesId", finesController.updateFines);

finesRouter.delete("/delete/:finesId", finesController.deleteFines);

finesRouter.post("/check-payment/:paymentKey", finesController.checkPayment);

finesRouter.get(
  "/filter-by-status/:status",
  finesController.filterFinesByStatus
);

finesRouter.put("/update-status/:finesId", finesController.updateFinesStatus);

module.exports = finesRouter;
