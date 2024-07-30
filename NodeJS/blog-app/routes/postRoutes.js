const express = require("express");
const postRouter = express.Router();
const postController = require("../controllers/postController");
const authenticateUser = require("../middlewares/userAuth");

postRouter.route("/").get(postController.getAllPosts);

postRouter
  .route("/user/:userId")
  .get(authenticateUser, postController.getUserPosts);

postRouter.route("/:postId").get(postController.getPost);


postRouter.route("/").post(authenticateUser, postController.createPost);

postRouter.route("/:postId").patch(authenticateUser,postController.updatePost);

postRouter.route("/:postId").delete(authenticateUser,postController.deletePost);




module.exports = postRouter;
