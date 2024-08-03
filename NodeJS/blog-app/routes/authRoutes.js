const express = require("express");
const authRouter = express.Router();
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/userAuth");

/**
 * @swagger
 * /auth/signup:
 *   post:
 *     summary: Sign up a new user
 *     description: Register a new user with email and password.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - OTP
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 12345
 *               firstName:
 *                 type: string
 *                 example: john
 *               lastName:
 *                 type: string
 *                 example: wick
 *               OTP:
 *                 type: integer
 *                 example: 12345
 *     responses:
 *       201:
 *         description: User signed up successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User Already Exists
 *       404:
 *         description: OTP Expired
 *       401:
 *         description: OTP Verification Failed
 */
authRouter.route("/signup").post(authController.signup);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Log in a user
 *     description: Authenticate user with email and password ans send access token to user via cookie.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       200:
 *         description: User logged in successfully
 *       404:
 *         description: User Not Found
 *       401:
 *         description: Invalid Password
 */
authRouter.route("/login").post(authController.login);

/**
 * @swagger
 * /auth/send-otp:
 *   post:
 *     summary: Send OTP to user's email
 *     description: Send a one-time password to the user's registered email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: OTP sent successfully
 *       400:
 *         description: Validation error
 *       409:
 *         description: User Already Exists
 */
authRouter.post("/send-otp", authController.sendOTP);

/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Forgot password
 *     description: Send a password reset link to the user's email.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 example: user@example.com
 *     responses:
 *       200:
 *         description: Password reset email sent successfully
 *       400:
 *         description: Validation error
 *       500:
 *         description: Failed to Send Password Reset Email
 *       404:
 *         description: User Not Found
 */
authRouter.route("/forgot-password").post(authController.forgotPassword);

/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password
 *     description: Reset user's password with a new password.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - newPassword
 *             properties:
 *               newPassword:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Password reset successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication Error
 */
authRouter
  .route("/reset-password")
  .post(authenticateUser, authController.resetPassword);

/**
 * @swagger
 * /auth/change-password:
 *   post:
 *     summary: Change current password
 *     description: Change the current password of the authenticated user.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - oldPassword
 *               - newPassword
 *             properties:
 *               oldPassword:
 *                 type: string
 *                 example: 12345
 *               newPassword:
 *                 type: string
 *                 example: 12345
 *     responses:
 *       200:
 *         description: Password changed successfully
 *       400:
 *         description: Validation error
 *       401: 
 *         description: Authentication Error
 *       403:
 *         description: Invalid Old Password
 */
authRouter
  .route("/change-password")
  .post(authenticateUser, authController.changeCurrentPassword);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Refresh access token
 *     description: Refresh the access token using the refresh token ans send it to user via cookie.
 *     responses:
 *       200:
 *         description: Access token refreshed successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Authentication Error
 */
authRouter.route("/refresh-token").post(authController.refreshAccessToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Log out a user
 *     description: Log out the authenticated user and clear the cookies.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User logged out successfully
 *       401:
 *         description: Authentication Error
 */
authRouter.route("/logout").post(authenticateUser, authController.logoutUser);

module.exports = authRouter;
