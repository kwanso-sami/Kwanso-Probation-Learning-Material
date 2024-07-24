const router = require("express").Router();
const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");

router.use("/users", userRouter);
router.use("/auth", authRouter);

module.exports = router;
