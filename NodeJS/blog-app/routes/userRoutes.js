const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/userAuth");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.route("/update-user").patch(authenticateUser, userController.updateUser);

router.route("/:id").get(authenticateUser, userController.getUser);

module.exports = router;
