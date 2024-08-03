const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/userAuth");

/**
 * @swagger
 * /users/update-user:
 *   patch:
 *     summary: Update user information
 *     description: Update the authenticated user's information.
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: "John"
 *               lastName:
 *                 type: string
 *                 example: "Doe"
 *               profileThumbnail:
 *                 type: string
 *                 example: "base64 image"
 *               profileImage:
 *                 type: string
 *                 example: "base64 image"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User Not Found
 *       401:
 *         description: Authorization Error
 */
userRouter
  .route("/update-user")
  .patch(authenticateUser, userController.updateUser);

/**
 * @swagger
 * /users/{userId}:
 *   get:
 *     summary: Get user information
 *     description: Retrieve information of a specific user by their ID.
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: uuid
 *           example: e49d22a2-35f3-4d51-bc02-b72461c108f4
 *         description: ID of the user to fetch
 *     responses:
 *       200:
 *         description: User fetched successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: User Not found
 *       401:
 *         description: Authorization Error
 */
userRouter.route("/:userId").get(authenticateUser, userController.getUser);

module.exports = userRouter;
