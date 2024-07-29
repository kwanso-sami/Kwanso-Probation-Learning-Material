const router = require("express").Router();
const userRouter = require("./userRoutes");
const authRouter = require("./authRoutes");
const postRouter = require("./postRoutes");

// const commentRouter = require("./commentsRoutes");


router.use("/auth", authRouter);
router.use("/users", userRouter);
router.use("/posts", postRouter);
// router.use("/comments", commentRouter);

module.exports = router;
