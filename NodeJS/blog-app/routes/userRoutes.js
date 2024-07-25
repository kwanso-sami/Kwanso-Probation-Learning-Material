const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authenticateUser = require("../middlewares/userAuth");


router.route("/update-user").patch(authenticateUser, userController.updateUser);


router.route("/:id").get(authenticateUser, userController.getUser);

module.exports = router;
