const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const authenticateUser = require("../middlewares/userAuth");

router.post("/signup", authController.signup);

router.post("/login", authController.login);

router.route("/updateUser").patch(authenticateUser, userController.updateUser);

module.exports = router;
