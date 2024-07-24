const apiRouter = require("./routes");
const helmet = require("helmet");
const xss = require("xss-clean");
const cors = require("cors");
const morgan = require("morgan");
const express = require("express");
const cookieParser = require("cookie-parser");
const { APIError, STATUS_CODES } = require("./utils/appError");
const httpLogger = require("./utils/loggers/httpLogger");
const { errorHandler } = require("./utils/errorHandler");
require("express-validator");
const app = express();

app.use(
  cors({
    origin: "*",
    allowedHeaders: ["Accept", "Content-Type", "Authorization"],
    credentials: true,
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(helmet());
app.use(xss());
app.use(cookieParser());

if (process.env.NODE_ENV !== "prod") {
  app.use(morgan("dev"));
} else {
  app.use(httpLogger);
}

//routing
app.use("/api/v1", apiRouter);

app.all("*", (req, res, next) => {
  const err = new APIError(
    `Can't find ${req.originalUrl} on the server!`,
    STATUS_CODES.NOT_FOUND
  );
  next(err);
});

app.use(errorHandler);

module.exports = app;
