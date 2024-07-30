const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");
const authenticateUser = require("../middlewares/userAuth");

commentRouter
  .route("/")
  .post(authenticateUser, commentController.createComment);

commentRouter
  .route("/")
  .get(commentController.getAllComments);


module.exports = commentRouter;
