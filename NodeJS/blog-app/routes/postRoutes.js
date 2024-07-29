const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const authenticateUser = require("../middlewares/userAuth");

router.route("/").get(postController.getAllPosts);

router.route("/:postId").get(postController.getAPost);

router.route("/").post(authenticateUser,postController.createAPost);

module.exports = router;
