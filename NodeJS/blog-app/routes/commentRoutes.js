const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/postController");
const authenticateUser = require("../middlewares/userAuth");

commentRouter
  .route("/")
  .post(authenticateUser, commentController.createComment);

module.exports = commentRouter;
