const express = require("express");
const bodyParser = require("body-parser");
const penaltyReasonController = require("../controllers/penaltyreason.controller");

const penaltyReasonRouter = express.Router();
penaltyReasonRouter.use(bodyParser.json());

penaltyReasonRouter.get("/list", penaltyReasonController.listPenaltyReasons);

penaltyReasonRouter.get(
  "/get/:id",
  penaltyReasonController.getPenaltyReasonsById
);

penaltyReasonRouter.post(
  "/create",
  penaltyReasonController.createPenaltyReasons
);

penaltyReasonRouter.put(
  "/update/:id",
  penaltyReasonController.updatePenaltyReasons
);

penaltyReasonRouter.delete(
  "/delete/:id",
  penaltyReasonController.deletePenaltyReasons
);

module.exports = penaltyReasonRouter;
