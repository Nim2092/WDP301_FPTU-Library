const express = require("express");
const bodyParser = require("body-parser");
const userController = require("../controllers/user.controller");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get("/getAll", userController.getAllUser);

userRouter.get("/get/:userId", userController.getUserById);

//not ok
userRouter.get("/role/:roleName", userController.getUserByRole);

userRouter.delete("/delete/:userId", userController.deleteUserById);

userRouter.post("/add", userController.addNewUser);

userRouter.get("/profile/:id", userController.viewProfile);

userRouter.put("/profile/update/:id", userController.editProfile);

userRouter.get("/by-booking/user/:userId", userController.getUserBookings);

userRouter.get("/by-booking/getAll", userController.getUserAllBookings);

userRouter.put(
  "/by-booking/booking/:bookingId",
  userController.updateUserBookings
);
module.exports = userRouter;
