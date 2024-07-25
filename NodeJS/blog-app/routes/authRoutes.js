const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/userAuth");

router.route("/signup").post(authController.signup);

router.route("/login").post(authController.login);


router.post('/send-otp', authController.sendOTP)



router.route("/forgot-password").post(authController.forgotPassword);

router
  .route("/reset-password")
  .post(authenticateUser, authController.resetPassword);




router
  .route("/change-password")
  .post(authenticateUser, authController.changeCurrentPassword);

router.route("/refresh-token").post(authController.refreshAccessToken);

router.route("/logout").post(authenticateUser, authController.logoutUser);




module.exports = router;
