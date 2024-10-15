const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get("/getAll", userController.getAllUser);

userRouter.get("/get/:userId", userController.getUserById);

userRouter.get("/role/:roleName", userController.getUserByRole);

userRouter.delete("/delete/:userId", userController.deleteUserById);

userRouter.post("/add", userController.addNewUser);

userRouter.get("/profile/:id", userController.viewProfile);

userRouter.put("/profile/update/:id", userController.editProfile);

userRouter.put("/profile/change-password/:id", userController.changePassword);

userRouter.get("/by-order/:userId", userController.getUserOrders);

userRouter.get("/by-booking/getAll", userController.getUserAllBookings);

userRouter.put(
  "/by-booking/booking/:bookingId",
  userController.updateUserBookings
);
module.exports = userRouter;
