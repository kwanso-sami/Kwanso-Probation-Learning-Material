const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/userAuth");

router.route("/update-user").patch(authenticateUser, userController.updateUser);

router.route("/:userId").get(authenticateUser, userController.getUser);

router
  .route("/:userId/posts")
  .get(authenticateUser, userController.getPostsOfUser);

module.exports = router;
