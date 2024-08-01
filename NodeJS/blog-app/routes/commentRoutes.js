const express = require("express");
const commentRouter = express.Router();
const commentController = require("../controllers/commentController");
const authenticateUser = require("../middlewares/userAuth");

commentRouter
  .route("/")
  .post(authenticateUser, commentController.createComment);

commentRouter.route("/").get(commentController.getAllComments);

commentRouter
  .route("/:commentId")
  .delete(authenticateUser, commentController.deleteComment);

commentRouter
  .route("/:commentId")
  .patch(authenticateUser, commentController.updateComment);


commentRouter
  .route("/:commentId/replies")
  .get(commentController.getCommentReplies);  

module.exports = commentRouter;
