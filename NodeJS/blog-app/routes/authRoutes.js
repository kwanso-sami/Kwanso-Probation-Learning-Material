const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/userAuth");

authRouter.route("/signup").post(authController.signup);

authRouter.route("/login").post(authController.login);

authRouter.post("/send-otp", authController.sendOTP);

authRouter.route("/forgot-password").post(authController.forgotPassword);

authRouter
  .route("/reset-password")
  .post(authenticateUser, authController.resetPassword);

authRouter
  .route("/change-password")
  .post(authenticateUser, authController.changeCurrentPassword);

authRouter.route("/refresh-token").post(authController.refreshAccessToken);

authRouter.route("/logout").post(authenticateUser, authController.logoutUser);

module.exports = authRouter;
