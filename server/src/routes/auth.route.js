const express = require("express");
const bodyParser = require("body-parser");
const authController = require("../controllers/authController");

const authRouter = express.Router();
authRouter.use(bodyParser.json()); 

// REGISTER (Librarian/Admin Registration)
// authRouter.post("/auth/register", verifyToken, authController.registerUser);

// REFRESH TOKEN
authRouter.post("/refresh", authController.requestRefreshToken);

// LOGIN (Librarian/Admin Login)
authRouter.post("/login", authController.loginUser);

// GOOGLE LOGIN
authRouter.post("/google-login", authController.loginWithGoogle);

// LOG OUT
authRouter.post("/logout", authController.logOut);

module.exports = authRouter;
