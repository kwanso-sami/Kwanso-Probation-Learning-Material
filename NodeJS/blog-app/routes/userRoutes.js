const express = require("express");
const userRouter = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/userAuth");

userRouter
  .route("/update-user")
  .patch(authenticateUser, userController.updateUser);

userRouter.route("/:userId").get(authenticateUser, userController.getUser);

module.exports = userRouter;
