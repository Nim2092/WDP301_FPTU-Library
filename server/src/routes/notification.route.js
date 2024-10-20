const express = require("express");
const bodyParser = require("body-parser");
const notificationController = require("../controllers/notification.controller");

const notificationRouter = express.Router();
notificationRouter.use(bodyParser.json());

notificationRouter.get("/getAll", notificationController.getAllNotifications);

notificationRouter.post("/create", notificationController.createNotification);

notificationRouter.get(
  "/get/:userId",
  notificationController.getNotificationsByUserId
);

notificationRouter.delete(
  "/delete/:id",
  notificationController.deleteNotification
);

//count number notifications unread by user id
notificationRouter.get(
  "/unreadCount/:userId",
  notificationController.getUnreadNotificationsByUserId
);

notificationRouter.put(
  "/markAsRead/:userId",
  notificationController.markNotificationAsRead
);

module.exports = notificationRouter;
